import { IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {

  @IsString()
  @IsOptional()
  name: string;

}

export class UpdateCategoryParams {
  @IsString({
    each: true
  })
  categoryId: string;
}
