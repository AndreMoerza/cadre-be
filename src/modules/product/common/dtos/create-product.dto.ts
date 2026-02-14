import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { ProductStatus } from '../../models/entities/product.entity';

export class CreateProductDto {
  @ApiProperty({ example: 'Coca Cola' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'uuid-of-brand' })
  @IsUUID()
  brandId!: string;

  @ApiProperty({ example: '12.50' })
  @Matches(/^\d+(\.\d{1,2})?$/)
  price!: string;

  @ApiProperty({ example: '12.50' })
  @Matches(/^\d+(\.\d{1,2})?$/)
  salePrice!: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  displayStock!: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  realStock!: number;

  @ApiProperty({ example: 'Carbonated soft drink', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ProductStatus, example: ProductStatus.ACTIVE })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiProperty({ example: 'uuid-of-category' })
  @IsUUID()
  categoryId!: string;
}
