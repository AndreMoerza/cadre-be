import { SWAGGER_SAMPLES } from '@app/constants/app.constant';
import { MediaFile } from '@app/modules/file/models/entities/file.entity';
import { Role } from '@app/modules/role/models/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '+1234567890',
  })
  @IsOptional()
  phone: string;

  @ApiProperty({
    type: () => Role,
  })
  @IsNotEmpty()
  role: Role;

  @ApiProperty({
    example: SWAGGER_SAMPLES.id,
    description: 'image file ID',
  })
  @IsOptional()
  image?: MediaFile;
}
