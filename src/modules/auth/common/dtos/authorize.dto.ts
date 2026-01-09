import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DeviceInfoDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Device name',
    example: 'iPhone 12 Pro Max',
  })
  deviceName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Device type',
    example: 'Mobile',
  })
  deviceType: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Device os',
    example: 'iOS',
  })
  deviceOs: string;
}

export class AuthorizeDto {
  @IsString()
  @IsEmail(
    {
      allow_ip_domain: false,
      allow_utf8_local_part: true,
      require_tld: true,
      require_display_name: false,
      ignore_max_length: true,
    },
    {
      message: 'Invalid email format, please provide a valid email address',
    },
  )
  @IsNotEmpty({
    message: 'Email is required',
  })
  @ApiProperty({
    description: 'User email',
    example: 'john@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'Password is required',
  })
  @ApiProperty({
    description: 'User password',
    example: 'password',
  })
  password: string;

  @IsOptional()
  @ApiProperty({
    description: 'Device information',
    type: () => DeviceInfoDto,
  })
  @ValidateNested({
    each: true,
  })
  deviceInfo: DeviceInfoDto;
}
