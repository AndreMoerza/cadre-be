import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const customValidationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    const objErrors = errors.reduce(
      (accumulator, currentValue) => ({
        ...accumulator,
        [currentValue.property]: Object.values(
          currentValue.constraints ?? {},
        ).join(', '),
      }),
      {},
    );
    return new HttpException(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message:
          Object.keys(objErrors).length > 0
            ? Object.values(objErrors)[0]
            : 'Unknown error',
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  },
});
