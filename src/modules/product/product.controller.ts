import { Body, Controller, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { AppDel, AppGet, AppPost, AppPut } from '@app/decorators/app.decorator';
import { Pagination } from '@app/decorators/pagination.decorator';
import { PaginatedParams } from '@app/interfaces/index.type';
import { CreateProductDto } from './common/dtos/create-product.dto';
import { UpdateProductDto } from './common/dtos/update-product.dto';

@ApiTags()
@Controller({
  path: 'product',
  version: '1',
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @AppGet('', {
    paginated: true,
    summary: 'Get all product',
  })
  async getProducts(@Pagination() pagination: PaginatedParams) {
    const result = await this.productService.findAll(pagination);
    return result;
  }

  @AppGet(':id', {
    summary: 'Get specific product by id',
  })
  async getProduct(@Param('id') id: string) {
    const result = await this.productService.findOne(id);
    return result;
  }

  @AppPost('', {
    summary: 'Create product',
  })
  async create(@Body() dto: CreateProductDto) {
    const result = await this.productService.create(dto);
    return result;
  }

  @AppPut(':id', {
    summary: 'Update product by id',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const result = await this.productService.update(id, dto);
    return result;
  }

  @AppDel(':id', {
    summary: 'Delete product by id',
  })
  async delete(@Param('id') id: string) {
    const result = await this.productService.remove(id);
    return result;
  }
}
