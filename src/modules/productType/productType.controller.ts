import { Body, Controller, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductTypeService } from './productType.service';
import { AppDel, AppGet, AppPost, AppPut } from '@app/decorators/app.decorator';
import { Pagination } from '@app/decorators/pagination.decorator';
import { PaginatedParams } from '@app/interfaces/index.type';
import { CreateProductTypeDto } from './common/dtos/create-product-type.dto';
import { UpdateProductTypeDto } from './common/dtos/update-product-type.dto';

@ApiTags()
@Controller({
  path: 'productType',
  version: '1',
})
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @AppGet('', {
    paginated: true,
    summary: 'Get all productType',
  })
  async getProductTypes(@Pagination() pagination: PaginatedParams) {
    const result = await this.productTypeService.findAll(pagination);
    return result;
  }

  @AppGet(':id', {
    summary: 'Get specific productType by id',
  })
  async getProductType(@Param('id') id: string) {
    const result = await this.productTypeService.findOne(id);
    return result;
  }

  @AppPost('', {
    summary: 'Create product type',
  })
  async create(@Body() dto: CreateProductTypeDto) {
    const result = await this.productTypeService.create(dto);
    return result;
  }

  @AppPut(':id', {
    summary: 'Update productType by id',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateProductTypeDto) {
    const result = await this.productTypeService.update(id, dto);
    return result;
  }

  @AppDel(':id', {
    summary: 'Delete productType by id',
  })
  async delete(@Param('id') id: string) {
    const result = await this.productTypeService.remove(id);
    return result;
  }
}
