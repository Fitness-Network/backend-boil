import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "base";
import { IsString } from "class-validator";
import { Document } from "mongoose";


export type CategoryDocument = Document & Category;

@Schema({
  timestamps: true
})
export class Category extends BaseSchema {
  @Prop()
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
