import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Brand } from './models/entities/brand.entity';
import { CreateBrandDto } from './common/dtos/create-brand.dto';
import { UpdateBrandDto } from './common/dtos/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaFile } from '../file/models/entities/file.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly repo: Repository<Brand>,

    @InjectRepository(MediaFile)
    private readonly fileRepo: Repository<MediaFile>,
  ) {}
  async create(dto: CreateBrandDto) {
    let image: MediaFile | null = null;

    if (dto.imageId) {
      image = await this.fileRepo.findOne({
        where: { id: dto.imageId },
      });

      if (!image) {
        throw new NotFoundException('Image not found');
      }
    }

    const brand = this.repo.create({
      ...dto,
      image,
    });

    return this.repo.save(brand);
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
    const brand = await this.repo.findOne({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');

    if (dto.imageId) {
      const image = await this.fileRepo.findOne({
        where: { id: dto.imageId },
      });
      if (!image) throw new NotFoundException('Image not found');
      brand.image = image;
    }

    Object.assign(brand, dto);

    return this.repo.save(brand);
  }

  async remove(id: string) {
    const e = await this.findOne(id);
    await this.repo.remove(e);
    return { ok: true };
  }
}
