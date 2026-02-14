import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryProviderModule } from './providers/provider.module';
import { Category } from './models/entities/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), CategoryProviderModule],
  providers: [CategoryService],
  exports: [],
  controllers: [CategoryController],
})
export class CategoryModule {}
