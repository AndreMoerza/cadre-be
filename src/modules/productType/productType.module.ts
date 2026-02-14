import { Module } from '@nestjs/common';
import { ProductTypeService } from './productType.service';
import { ProductTypeController } from './productType.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeProviderModule } from './providers/provider.module';
import { ProductType } from './models/entities/productType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductType]), ProductTypeProviderModule],
  providers: [ProductTypeService],
  exports: [],
  controllers: [ProductTypeController],
})
export class ProductTypeModule {}
