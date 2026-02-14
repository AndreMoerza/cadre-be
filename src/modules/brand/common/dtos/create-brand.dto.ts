import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ example: 'glo' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: 'glo' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'mail',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '0981290002020',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
