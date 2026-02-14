import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../models/entities/product.entity';
import {
  ProductMedia,
  ProductMediaRole,
  ProductMediaType,
} from '../models/entities/product-media.entity';
import { ApplicationConfig, R2Config } from '@app/interfaces/config.type';
import { MediaFile } from '../../file/models/entities/file.entity';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

type MulterS3File = Express.Multer.File & {
  key?: string;
  bucket?: string;
  location?: string;
};

@Injectable()
export class ProductMediaService {
  private readonly s3: S3Client;
  private readonly r2: R2Config;

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(MediaFile)
    private readonly fileRepo: Repository<MediaFile>,
    @InjectRepository(ProductMedia)
    private readonly productMediaRepo: Repository<ProductMedia>,
    private readonly config: ConfigService<ApplicationConfig>,
  ) {
    // ✅ typed access: get r2 object
    this.r2 = this.config.getOrThrow('r2');

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: this.r2.endpoint,
      credentials: {
        accessKeyId: this.r2.accessKeyId,
        secretAccessKey: this.r2.secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  private publicUrl(key: string) {
    const base = this.r2.publicBaseUrl;
    return base ? `${base.replace(/\/$/, '')}/${key}` : key;
  }

  private typeFromMime(mime?: string): ProductMediaType {
    return mime?.startsWith('video/')
      ? ProductMediaType.VIDEO
      : ProductMediaType.IMAGE;
  }

  async upload(productId: string, files: MulterS3File[], req: any) {
    if (!files?.length) throw new BadRequestException('No files uploaded');

    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const roleFromBody =
      (req.body?.role as ProductMediaRole) || ProductMediaRole.GALLERY;

    const startOrder = Number.isFinite(+req.body?.startOrder)
      ? +req.body.startOrder
      : 0;

    const isPrivate =
      req.body?.private === 'true' || req.body?.private === true;

    const links: ProductMedia[] = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];

      // multer-s3 should provide key
      if (!f.key) {
        throw new BadRequestException(
          'Upload succeeded but missing object key (multer-s3 not active)',
        );
      }

      const type = this.typeFromMime(f.mimetype);
      const role =
        type === ProductMediaType.VIDEO ? ProductMediaRole.VIDEO : roleFromBody;

      const savedFile = await this.fileRepo.save(
        this.fileRepo.create({
          name: f.originalname || 'unknown',
          mimeType: f.mimetype,
          key: f.key,
          bucket: f.bucket ?? this.r2.bucket,
          private: isPrivate,
          path: isPrivate ? f.key : f.location || this.publicUrl(f.key),
          createdBy: req.user ?? null,
          updatedBy: req.user ?? null,
        }),
      );

      const savedLink = await this.productMediaRepo.save(
        this.productMediaRepo.create({
          product,
          file: savedFile,
          type,
          role,
          order: startOrder + i,
        }),
      );

      links.push(savedLink);
    }

    return links;
  }

  async remove(productId: string, productMediaId: string) {
    const link = await this.productMediaRepo.findOne({
      where: { id: productMediaId },
      relations: { product: true, file: true },
    });

    if (!link || link.product?.id !== productId) {
      throw new NotFoundException('Product media not found');
    }

    const file = link.file;

    // 1️⃣ delete relation first
    await this.productMediaRepo.remove(link);

    if (!file) {
      return { ok: true };
    }

    // 2️⃣ delete object from R2 (always)
    if (file.bucket && file.key) {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: file.bucket,
          Key: file.key,
        }),
      );
    }

    // 3️⃣ delete file metadata
    await this.fileRepo.remove(file);

    return {
      ok: true,
      deletedFileId: file.id,
    };
  }
}
