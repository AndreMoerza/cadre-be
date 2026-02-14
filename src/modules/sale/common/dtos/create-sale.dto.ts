import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  ValidateNested,
} from 'class-validator';

class SaleItemInput {
  @ApiProperty({ example: 'uuid-of-product' })
  @IsUUID()
  productId!: string;

  @ApiProperty({ example: '2.000' })
  @Matches(/^\d+(\.\d{1,3})?$/)
  quantity!: string;

  @ApiProperty({ example: '12.50' })
  @Matches(/^\d+(\.\d{1,2})?$/)
  unitPrice!: string;

  @ApiProperty({ example: '0.00' })
  @Matches(/^\d+(\.\d{1,2})?$/)
  discount!: string;
}

class PaymentInput {
  @ApiProperty({ example: 'uuid-of-payment-method' })
  @IsUUID()
  methodId!: string;

  @ApiProperty({ example: '25.00' })
  @Matches(/^\d+(\.\d{1,2})?$/)
  amount!: string;

  @ApiProperty({ example: '2025-09-07T12:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  paidAt?: string;

  @ApiProperty({ example: 'INV-123456', required: false })
  @IsOptional()
  @IsString()
  reference?: string;
}

export class CreateSaleDto {
  @ApiProperty({ example: 'uuid-of-cashier' })
  @IsUUID()
  cashierId!: string;

  @ApiProperty({ type: [SaleItemInput] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SaleItemInput)
  items!: SaleItemInput[];

  @ApiProperty({ example: '25.00' })
  @Matches(/^\d+(\.\d{1,2})?$/)
  subtotal!: string;

  @ApiProperty({ example: '0.00' })
  @Matches(/^\d+(\.\d{1,2})?$/)
  discountTotal!: string;

  @ApiProperty({ example: '2.50' })
  @Matches(/^\d+(\.\d{1,2})?$/)
  taxTotal!: string;

  @ApiProperty({ example: '27.50' })
  @Matches(/^\d+(\.\d{1,2})?$/)
  grandTotal!: string;

  @ApiProperty({ example: '27.50' })
  @Matches(/^\d+(\.\d{1,2})?$/)
  paidAmount!: string;

  @ApiProperty({ example: '0.00' })
  @Matches(/^\d+(\.\d{1,2})?$/)
  dueAmount!: string;
}
