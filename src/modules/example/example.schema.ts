import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "base";
import { Category } from "modules/category/category.schema";
import mongoose, { Document } from "mongoose";


export type ExampleDocument = Document & Example;

@Schema({
  timestamps: true
})
export class Example extends BaseSchema {

  @Prop()
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    autopopulate: true
  })
  category: Category;
}

export const ExampleSchema = SchemaFactory.createForClass(Example);
ExampleSchema.plugin(require('mongoose-autopopulate'));
