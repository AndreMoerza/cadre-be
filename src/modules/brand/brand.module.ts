import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandProviderModule } from './providers/provider.module';
import { Brand } from './models/entities/brand.entity';
import { MediaFile } from '../file/models/entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, MediaFile]), BrandProviderModule],
  providers: [BrandService],
  exports: [],
  controllers: [BrandController],
})
export class BrandModule {}
