import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandProviderModule } from './providers/provider.module';
import { Brand } from './models/entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand]), BrandProviderModule],
  providers: [BrandService],
  exports: [],
  controllers: [BrandController],
})
export class BrandModule {}
