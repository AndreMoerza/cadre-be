import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Brand } from './models/entities/brand.entity';
import { CreateBrandDto } from './common/dtos/create-brand.dto';
import { UpdateBrandDto } from './common/dtos/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly repo: Repository<Brand>,
  ) {}
  create(dto: CreateBrandDto) {
    const e = this.repo.create(dto);
    return this.repo.save(e);
  }

  findAll() {
    return this.repo.findAndCount({
      relations: {
        image: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('Brand not found');
    return e;
  }

  async update(id: string, dto: UpdateBrandDto) {
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
