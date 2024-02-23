import { ObjectId } from "mongoose";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class LottieIdInput {
  @Field(() => String)
  lottieId: ObjectId;
}
