import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';
import { CreateProductDto } from '../common/dtos/create-product.dto';
import { UpdateProductDto } from '../common/dtos/update-product.dto';
import { Product, ProductStatus } from '../models/entities/product.entity';
import { Category } from '../../category/models/entities/category.entity';
import { Brand } from '../../brand/models/entities/brand.entity';
import { MediaFile } from '@app/modules/file/models/entities/file.entity';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ProductMedia } from '../models/entities/product-media.entity';
import { ApplicationConfig } from '@app/interfaces/config.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
  private readonly s3: S3Client;
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    @InjectRepository(Category)
    private readonly catRepo: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    @InjectRepository(ProductMedia)
    private readonly productMediaRepo: Repository<ProductMedia>,
    @InjectRepository(MediaFile)
    private readonly fileRepo: Repository<MediaFile>,
    private readonly config: ConfigService<ApplicationConfig>,
  ) {
    const r2 = this.config.getOrThrow('r2');

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: r2.endpoint,
      credentials: {
        accessKeyId: r2.accessKeyId,
        secretAccessKey: r2.secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async create(dto: CreateProductDto) {
    const category = await this.catRepo.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) throw new NotFoundException('category not found');

    const brand = await this.brandRepo.findOne({
      where: { id: dto.brandId },
    });
    if (!category) throw new NotFoundException('brand not found');

    const partial = {
      name: dto.name ?? 'N/A',
      brand,
      price: dto.price, // entity expects string for numeric columns
      salePrice: dto.salePrice,
      displayStock: String(dto.displayStock),
      realStock: String(dto.realStock),
      description: dto.description ?? null,
      status: dto.status ?? ProductStatus.ACTIVE,
      category,
    } as DeepPartial<Product>;

    const e = this.repo.create(partial);
    return this.repo.save(e);
  }

  findAll(opts: FindManyOptions<Product>) {
    return this.repo.findAndCount({
      ...opts,
      relations: {
        media: true,
        category: true,
        brand: true,
      },
      where: {
        ...opts.where,
      },
    });
  }

  async findAllByBrandAndCategory(
    brandId: string,
    categoryId: string,
    opts: FindManyOptions<Product>,
  ) {
    return this.repo.findAndCount({
      ...opts,
      relations: {
        media: true,
        brand: true,
        category: true,
      },
      where: {
        brand: { id: brandId },
        category: { id: categoryId },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const e = await this.repo.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!e) throw new NotFoundException('Product not found');
    return e;
  }

  async update(id: string, dto: UpdateProductDto) {
    const e = await this.findOne(id);
    if (dto.categoryId) {
      const type = await this.catRepo.findOne({
        where: { id: dto.categoryId },
      });
      if (!type) throw new NotFoundException('ProductType not found');
      (e as any).type = type;
    }
    Object.assign(e, { ...dto, category: (dto as any).category ?? e.category });
    return this.repo.save(e);
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    // 1) ambil semua media + file
    const medias = await this.productMediaRepo.find({
      where: { product: { id } as any },
      relations: { file: true },
    });

    // 2) delete links dulu
    if (medias.length) {
      await this.productMediaRepo.remove(medias);
    }

    // 3) kumpulkan file unik
    const uniqueFiles = new Map<string, MediaFile>();
    for (const m of medias) {
      if (m.file?.id) uniqueFiles.set(m.file.id, m.file);
    }

    // 4) cek apakah file masih dipakai product lain (reusable)
    // kalau tidak reusable di sistem kamu, kamu bisa skip check ini
    const fileIds = [...uniqueFiles.keys()];
    if (fileIds.length) {
      for (const fileId of fileIds) {
        const stillUsed = await this.productMediaRepo.count({
          where: { file: { id: fileId } as any },
        });

        if (stillUsed > 0) {
          uniqueFiles.delete(fileId); // jangan delete file & object
        }
      }
    }

    // 5) delete object di R2
    for (const file of uniqueFiles.values()) {
      if (!file.bucket || !file.key) continue;

      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: file.bucket,
          Key: file.key,
        }),
      );
    }

    // 6) delete file metadata
    if (uniqueFiles.size) {
      await this.fileRepo.remove([...uniqueFiles.values()]);
    }

    // 7) delete product
    await this.repo.remove(product);

    return {
      ok: true,
      deletedMedia: medias.length,
      deletedFiles: uniqueFiles.size,
    };
  }
}
