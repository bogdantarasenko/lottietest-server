import { Document } from "mongoose";
import { HideField } from "@nestjs/graphql";
import { ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "../common/base.schema";

@ObjectType()
@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @HideField()
  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isActive: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
