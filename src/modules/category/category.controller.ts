import { Body, Controller, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AppDel,
  AppGet,
  AppPost,
  AppPut,
  GuardAccessControl,
} from '@app/decorators/app.decorator';
import { CreateCategoryDto } from './common/dtos/create-category.dto';
import { UpdateCategoryDto } from './common/dtos/update-category.dto';
import { CategoryService } from './category.service';

@ApiTags()
@Controller({
  path: 'category',
  version: '1',
})
@GuardAccessControl()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @AppGet('', {
    paginated: true,
    summary: 'Get all productType',
  })
  async getProductTypes() {
    const result = await this.categoryService.findAll();
    return result;
  }

  @AppGet(':id', {
    summary: 'Get specific category by id',
  })
  async getProductType(@Param('id') id: string) {
    const result = await this.categoryService.findOne(id);
    return result;
  }

  @AppPost('', {
    summary: 'Create product category',
  })
  async create(@Body() dto: CreateCategoryDto) {
    const result = await this.categoryService.create(dto);
    return result;
  }

  @AppPut(':id', {
    summary: 'Update category by id',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    const result = await this.categoryService.update(id, dto);
    return result;
  }

  @AppDel(':id', {
    summary: 'Delete category by id',
  })
  async delete(@Param('id') id: string) {
    const result = await this.categoryService.remove(id);
    return result;
  }
}
