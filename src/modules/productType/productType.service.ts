import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { ProductType } from './models/entities/productType.entity';
import { CreateProductTypeDto } from './common/dtos/create-product-type.dto';
import { UpdateProductTypeDto } from './common/dtos/update-product-type.dto';
@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductType)
    private readonly repo: Repository<ProductType>,
  ) {}

  create(dto: CreateProductTypeDto) {
    const e = this.repo.create(dto);
    return this.repo.save(e);
  }

  findAll(opts: FindManyOptions<ProductType>) {
    return this.repo.findAndCount(opts);
  }

  async findOne(id: string) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('ProductType not found');
    return e;
  }

  async update(id: string, dto: UpdateProductTypeDto) {
    const e = await this.findOne(id);
    Object.assign(e, dto);
    return this.repo.save(e);
  }

  async remove(id: string) {
    const e = await this.findOne(id);
    await this.repo.remove(e);
    return { ok: true };
  }
}
