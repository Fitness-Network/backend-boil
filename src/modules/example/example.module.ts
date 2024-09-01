import { Module } from "@nestjs/common";
import { ExampleController } from "./example.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Example, ExampleSchema } from "./example.schema";
import { ExampleService } from "./exmple.service";

@Module({
  controllers: [
    ExampleController
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Example.name, schema: ExampleSchema }
    ])
  ],
  exports: [
    ExampleService
  ],
  providers: [
    ExampleService
  ],
})
export class ExampleModule {

}
