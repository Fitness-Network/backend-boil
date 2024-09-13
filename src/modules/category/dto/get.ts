import { IsString } from "class-validator";
import { Pagination } from "utils/response";

export class GetAllCategoryQuery extends Pagination {

}

export class GetOneCategoryParam {
  @IsString()
  categoryId: string;
}
