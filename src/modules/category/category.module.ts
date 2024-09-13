import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "./category.schema";
import { CategoryService } from "./category.service";

@Module({
  controllers: [
    CategoryController
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema }
    ])
  ],
  exports: [
    CategoryService
  ],
  providers: [
    CategoryService
  ],
})
export class CategoryModule {

}
