import { IsString } from "class-validator";
import { BaseQuery } from "base/base.query";

export class GetAllExampleQuery extends BaseQuery {

}

export class GetOneExampleParam {
  @IsString()
  exampleId: string;
}
