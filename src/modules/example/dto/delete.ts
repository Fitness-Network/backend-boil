import { IsString } from "class-validator";

export class DeleteExampleQuery {

  @IsString({
    each: true
  })
  ids: Array<string>;
}
