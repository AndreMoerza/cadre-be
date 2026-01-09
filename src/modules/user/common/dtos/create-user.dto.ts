import { SWAGGER_SAMPLES } from '@app/constants/app.constant';
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
}
