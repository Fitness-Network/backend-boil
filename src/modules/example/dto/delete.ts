import { IsString } from "class-validator";

export class DeleteExampleQuery {

  @IsString({
    each: true
  })
  exampleIds: Array<string>;
}
