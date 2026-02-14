import { Body, Controller, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SaleService } from './sale.service';
import { AppGet, AppPost } from '@app/decorators/app.decorator';
import { CreateSaleDto } from './common/dtos/create-sale.dto';

@ApiTags()
@Controller({
  path: 'sale',
  version: '1',
})
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @AppGet('', {
    paginated: false,
    summary: 'Get all sale',
  })
  async findAll() {
    const result = await this.saleService.findAll();
    return result;
  }

  @AppGet(':id', {
    summary: 'Get sale by id',
  })
  async getProduct(@Param('id') id: string) {
    const result = await this.saleService.findOne(id);
    return result;
  }

  @AppPost('', {
    summary: 'Create product',
  })
  async create(@Body() dto: CreateSaleDto) {
    const result = await this.saleService.create(dto);
    return result;
  }
}
