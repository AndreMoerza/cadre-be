import { SWAGGER_SAMPLES } from '@app/constants/app.constant';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateEmployeeDto {
    @ApiProperty({
        example: 'john',
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        example: 20,
    })
    @IsInt()
    @Min(18)
    age!: number;

    @ApiProperty({
        example: 'admin',
    })
    @IsString()
    @IsNotEmpty()
    position!: string;

    @ApiProperty({
        example: 20000000,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    salary!: number;
}

