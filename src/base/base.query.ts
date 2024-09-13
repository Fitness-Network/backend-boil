import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";
import { FilterQuery } from "mongoose";
import { MongodbFilterTransform } from "./filter";

export class BaseQuery {

  @ApiProperty({
    required: false
  })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiProperty({
    required: false
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit: number = 10;

  @ApiProperty({
    required: false
  })
  @IsString()
  @IsOptional()
  sort: string = '';

  @ApiProperty({
    required: false,
    name: 'filters',
    isArray: true,
    type: 'object'
  })
  @IsOptional()
  @MongodbFilterTransform()
  filters: FilterQuery<any>;
}

