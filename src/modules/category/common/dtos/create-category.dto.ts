import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'FOOD' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: 'Food & Beverage' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Consumable items like snacks, drinks',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;
}
