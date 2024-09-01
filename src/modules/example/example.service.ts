import { Example, ExampleDocument } from "./example.schema";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "base";
import { Model } from "mongoose";

export class ExampleService extends BaseService<ExampleDocument> {
  constructor(
    @InjectModel(Example.name)
    private exampleModel: Model<ExampleDocument>
  ) {
    super(exampleModel)
  }
}
