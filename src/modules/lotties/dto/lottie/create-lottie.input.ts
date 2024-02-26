import { InputType } from "@nestjs/graphql";

@InputType()
export class CreateLottieInput {
  tags?: string[];
}
