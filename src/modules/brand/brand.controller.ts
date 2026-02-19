import { Body, Controller, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import {
  AppDel,
  AppGet,
  AppPost,
  AppPut,
  GuardAccessControl,
} from '@app/decorators/app.decorator';
import { UpdateBrandDto } from './common/dtos/update-brand.dto';
import { CreateBrandDto } from './common/dtos/create-brand.dto';

@ApiTags()
@Controller({
  path: 'brand',
  version: '1',
})
@GuardAccessControl()
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @AppGet('', {
    paginated: true,
    summary: 'Get all brands',
  })
  async getProductTypes() {
    const result = await this.brandService.findAll();
    return result;
  }

  @AppGet(':id', {
    summary: 'Get specific brand by id',
  })
  async getProductType(@Param('id') id: string) {
    const result = await this.brandService.findOne(id);
    return result;
  }

  @AppPost('', {
    summary: 'Create product brand',
  })
  async create(@Body() dto: CreateBrandDto) {
    const result = await this.brandService.create(dto);
    return result;
  }

  @AppPut(':id', {
    summary: 'Update brand by id',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    const result = await this.brandService.update(id, dto);
    return result;
  }

  @AppDel(':id', {
    summary: 'Delete brand by id',
  })
  async delete(@Param('id') id: string) {
    const result = await this.brandService.remove(id);
    return result;
  }
}
