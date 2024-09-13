import { Category, CategoryDocument } from "./category.schema";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "base";
import { Model } from "mongoose";

export class CategoryService extends BaseService<CategoryDocument> {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>
  ) {
    super(categoryModel)
  }
}
