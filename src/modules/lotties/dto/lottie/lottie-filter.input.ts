import { InputType, Field } from '@nestjs/graphql';
import { ObjectId } from "mongoose";

@InputType()
export class LottieFilterInput {
  @Field(() => String)
  id?: ObjectId;

  @Field(type => [String], { nullable: true })
  tags?: string[];
}
