import { IsOptional, IsString } from "class-validator";

export class UpdateExampleDto {
  @IsString()
  @IsOptional()
  name?: string;
}

export class UpdateExampleParams {
  @IsString({
    each: true
  })
  id: string;
}
