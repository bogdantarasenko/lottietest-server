import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateLottieInput {
  @Field(() => [String!], { nullable: true })
  tags?: string[];
}
