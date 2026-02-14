import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateProductDto } from './common/dtos/create-product.dto';
import { UpdateProductDto } from './common/dtos/update-product.dto';
import { Product } from './models/entities/product.entity';
import { ProductType } from '../productType/models/entities/productType.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    @InjectRepository(ProductType)
    private readonly typeRepo: Repository<ProductType>,
  ) {}

  async create(dto: CreateProductDto) {
    const type = await this.typeRepo.findOne({ where: { id: dto.typeId } });
    if (!type) throw new NotFoundException('ProductType not found');

    const e = this.repo.create({
      name: dto.name,
      sku: dto.sku,
      price: dto.price,
      description: dto.description,
      status: dto.status,
      type,
    });
    return this.repo.save(e);
  }

  findAll(opts: FindManyOptions<Product>) {
    return this.repo.findAndCount({
      ...opts,
      relations: { type: true },
      where: {
        ...opts.where,
      },
    });
  }

  async findOne(id: string) {
    const e = await this.repo.findOne({
      where: { id },
      relations: { type: true },
    });
    if (!e) throw new NotFoundException('Product not found');
    return e;
  }

  async update(id: string, dto: UpdateProductDto) {
    const e = await this.findOne(id);
    if (dto.typeId) {
      const type = await this.typeRepo.findOne({ where: { id: dto.typeId } });
      if (!type) throw new NotFoundException('ProductType not found');
      (e as any).type = type;
    }
    Object.assign(e, { ...dto, type: (dto as any).type ?? e.type });
    return this.repo.save(e);
  }

  async remove(id: string) {
    const e = await this.findOne(id);
    await this.repo.remove(e);
    return { ok: true };
  }
}
