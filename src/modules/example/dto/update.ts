import { IsString } from "class-validator";

export class UpdateExampleDto { }

export class UpdateExampleParams {
  @IsString({
    each: true
  })
  exampleId: string;
}
