import { SWAGGER_SAMPLES } from '@app/constants/app.constant';
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
    example: '+1234567890',
  })
  @IsOptional()
  phone: string;
}

export class UpdateUserCombineDto {
  @IsOptional()
  @Type(() => UserUpdateDto)
  @ApiProperty({
    type: () => UserUpdateDto,
  })
  user: UserUpdateDto;
}
