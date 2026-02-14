import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductProviderModule } from './providers/provider.module';
import { Product } from './models/entities/product.entity';
import { Category } from '../category/models/entities/category.entity';
import { Brand } from '../brand/models/entities/brand.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Brand]),
    ProductProviderModule,
  ],
  providers: [ProductService],
  exports: [],
  controllers: [ProductController],
})
export class ProductModule {}
