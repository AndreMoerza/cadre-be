import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ProductProviderModule } from './providers/provider.module';

import { ProductService } from './services/product.service';
import { ProductMediaService } from './services/product-media.service';

import { ProductController } from './controllers/product.controller';
import { ProductMediaController } from './controllers/product-media.controller';

import { Product } from './models/entities/product.entity';
import { ProductMedia } from './models/entities/product-media.entity';
import { Category } from '../category/models/entities/category.entity';
import { Brand } from '../brand/models/entities/brand.entity';
import { MediaFile } from '../file/models/entities/file.entity';

import { ApplicationConfig } from '@app/interfaces/config.type';
import { FileUtil } from '../file/common/utils/index.util';

@Module({
  imports: [
    ConfigModule, // ✅ needed for ConfigService in registerAsync

    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<ApplicationConfig>) => {
        return FileUtil.getStorage(config);
      },
    }),

    TypeOrmModule.forFeature([
      Product,
      ProductMedia,
      Category,
      Brand,
      MediaFile,
    ]),

    ProductProviderModule,
  ],

  controllers: [ProductController, ProductMediaController],

  providers: [ProductService, ProductMediaService],

  exports: [ProductService, ProductMediaService],
})
export class ProductModule {}
