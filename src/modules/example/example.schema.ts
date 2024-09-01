import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "base";
import { Document } from "mongoose";


export type ExampleDocument = Document & Example;

@Schema({
  timestamps: true
})
export class Example extends BaseSchema {
  @Prop({
    required: true
  })
  name: string;
}

export const ExampleSchema = SchemaFactory.createForClass(Example);
