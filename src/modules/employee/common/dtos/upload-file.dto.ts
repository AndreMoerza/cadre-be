// your dto for the service
// please don't use the dto for any other service(s) if posible.

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({ example: 'some/path', required: false })
  @Transform(({ value }) => value?.toLowerCase()?.trim() || value)
  @IsOptional()
  path: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  private: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: false,
    required: false,
  })
  @IsOptional()
  file: Express.Multer.File;
}
