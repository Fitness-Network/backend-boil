import { IsString } from "class-validator";
import { Pagination } from "utils/response";

export class GetAllExampleQuery extends Pagination {

}

export class GetOneExampleParam {
  @IsString()
  exampleId: string;
}
