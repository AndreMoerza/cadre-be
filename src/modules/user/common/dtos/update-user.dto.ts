import { SWAGGER_SAMPLES } from '@app/constants/app.constant';
import { MediaFile } from '@app/modules/file/models/entities/file.entity';
import { Role } from '@app/modules/role/models/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({
    example: 'johndoe@gmail.com',
  })
  @IsOptional()
  email: string;

  @ApiProperty({
    example: 'johndoe@gmail.com',
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    example: 'password',
  })
  @IsOptional()
  password: string;

  @ApiProperty({
    type: () => Role,
    example: SWAGGER_SAMPLES.id,
  })
  @IsOptional()
  role: Role;

  @ApiProperty({
    example: '+1234567890',
  })
  @IsOptional()
  phone: string;

  @ApiProperty({
    example: SWAGGER_SAMPLES.id,
    description: 'image file ID',
  })
  @IsOptional()
  image?: MediaFile;
}

export class UpdateUserCombineDto {
  @IsOptional()
  @Type(() => UserUpdateDto)
  @ApiProperty({
    type: () => UserUpdateDto,
  })
  user: UserUpdateDto;
}
