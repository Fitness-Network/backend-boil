import { BaseQuery } from "base/base.query";
import { IsString } from "class-validator";

export class GetAllExampleQuery extends BaseQuery {

}

export class GetOneExampleParam {
  @IsString()
  exampleId: string;
}
