import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';
import { CreateProductDto } from './common/dtos/create-product.dto';
import { UpdateProductDto } from './common/dtos/update-product.dto';
import { Product, ProductStatus } from './models/entities/product.entity';
import { Category } from '../category/models/entities/category.entity';
import { Brand } from '../brand/models/entities/brand.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    @InjectRepository(Category)
    private readonly catRepo: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) {}

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
        category: true,
        brand: true,
      },
      where: {
        ...opts.where,
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
    const e = await this.findOne(id);
    await this.repo.remove(e);
    return { ok: true };
  }
}
