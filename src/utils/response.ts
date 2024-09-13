import { mixin } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";
type Constructor<T = {}> = abstract new (...args: any[]) => T;

export function PaginationResponseFactory<T extends Constructor>(
  Result: T
) {
  class Response extends PaginationResponse<T> {
    @ApiProperty({
      isArray: true,
      type: Result
    })
    data: Array<T>;
  }
  return mixin(Response);
}

export class PaginationResponse<T> {

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty({
    isArray: true,
  })
  data: Array<T>;
}

export class Pagination {

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
}

export class DeleteResponse {
  @ApiProperty()
  deleted: number;
}
