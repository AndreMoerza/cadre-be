import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './models/entities/category.entity';
import { CreateCategoryDto } from './common/dtos/create-category.dto';
import { UpdateCategoryDto } from './common/dtos/update-category.dto';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  create(dto: CreateCategoryDto) {
    const e = this.repo.create(dto);
    return this.repo.save(e);
  }

  findAll() {
    return this.repo.findAndCount({
      relations: {
        products: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('ProductType not found');
    return e;
  }

  async update(id: string, dto: UpdateCategoryDto) {
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
