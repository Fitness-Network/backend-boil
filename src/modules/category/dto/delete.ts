import { IsString } from "class-validator";

export class DeleteCategoryQuery {

  @IsString({
    each: true
  })
  ids: Array<string>;
}
