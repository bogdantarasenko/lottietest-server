import * as mongoose from "mongoose";
import { Document } from "mongoose";
import { ObjectType, Field } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { User } from "../../users/users.schema";
import { BaseSchema } from "../../common/base.schema";

@ObjectType()
@Schema({ timestamps: true })
export class Lottie extends BaseSchema {
  @Prop({ unique: true, required: false, default: null })
  path?: string;

  @Field(type => [String])
  @Prop([String])
  tags: string[];

  @Field(type => User)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  author: User;
}

export type LottieDocument = Lottie & Document;

export const LottieSchema = SchemaFactory.createForClass(Lottie);
