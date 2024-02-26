import { Document } from "mongoose";
import { ObjectType } from "@nestjs/graphql";
import { Field, HideField } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "../../common/base.schema";

@ObjectType()
@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Field(() => String)
  @Prop({ unique: true, required: true })
  username: string;

  @Field(() => String)
  @Prop({ unique: true, required: true })
  email: string;

  @HideField()
  @Field(() => String)
  @Prop({ required: true })
  password: string;

  @Field(() => Boolean, { defaultValue: false })
  @Prop({ default: false })
  isActive: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
