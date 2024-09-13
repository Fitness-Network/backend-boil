import { applyDecorators, Injectable, mixin } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, registerDecorator, ValidationArguments, ValidationError, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { isArray } from "lodash";
import { FilterQuery, isObjectIdOrHexString, QuerySelector } from "mongoose";

@ValidatorConstraint({ name: 'MongodbFilter', async: true })
@Injectable()
export class MongodbFilterRule implements ValidatorConstraintInterface {

  async validate(value: any) {
    if (typeof value === 'string') value = JSON.parse(value);
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return "";
  }
}

export function IsMongodbFilter(validationOptions: ValidationOptions) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: 'MongodbFilter',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: MongodbFilterRule
    })
  }
}

export const MongodbFilterTransform = () => {
  return applyDecorators(
    Transform(({ value }) => {
      return transformFilter(value);
    })
  )
}

export class LogicalFilter {

  @IsString()
  operator: "$or" | "$and";

  @IsArray()
  value: Array<any> = [];
}

export class ConditionalFilter {

  @IsString()
  field: string;

  @IsString()
  operator: keyof QuerySelector<any>;

  @IsArray()
  value: any;

}

export const transformFilter = (filter: LogicalFilter | ConditionalFilter | string): FilterQuery<any> => {
  if (typeof filter === 'string') return transformFilter(JSON.parse(filter));
  if (!(filter as ConditionalFilter).field) {
    const result = filter as LogicalFilter;
    if (!isArray(result.value)) throw new ValidationError();
    return {
      [result.operator]: result.value.map(v => transformFilter(v))
    }
  } else {
    const result = filter as ConditionalFilter;
    return {
      [result.field]: {
        [result.operator]: result.value
      }
    }
  }
}
