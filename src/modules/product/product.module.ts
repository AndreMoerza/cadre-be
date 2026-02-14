import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductProviderModule } from './providers/provider.module';
import { Product } from './models/entities/product.entity';
import { ProductType } from '../productType/models/entities/productType.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductType]),
    ProductProviderModule,
  ],
  providers: [ProductService],
  exports: [],
  controllers: [ProductController],
})
export class ProductModule {}
