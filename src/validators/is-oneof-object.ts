import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable } from '@nestjs/common';

/**
 *
 *
 * @export
 * @class IsOneOfObject
 * @implements {ValidatorConstraintInterface}
 * @example
 * ```typescript
 * class ExampleDto {
 *   (alias) Validate(IsOneOfObject, [spokenLanguages], {
 *     message: "Please select one of the spoken languages",
 *   })
 *   spokenLanguages: keyof typeof spokenLanguages;
 * }
 * ```
 */
@Injectable()
@ValidatorConstraint({ name: 'IsOneOfObject', async: true })
export class IsOneOfObject implements ValidatorConstraintInterface {
  async validate(val: string, validationArguments: ValidationArguments) {
    const obj = validationArguments.constraints[0];
    const keys = Object.keys(obj);
    return Boolean(keys.includes(val));
  }
}
