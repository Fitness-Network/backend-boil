import { IsMongoId, IsString } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsMongoId()
  category: string;
}
