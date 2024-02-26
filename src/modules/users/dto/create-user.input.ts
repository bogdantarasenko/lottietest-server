import { IsNotEmpty, MinLength } from "class-validator";

import { Field, InputType, OmitType } from "@nestjs/graphql";

import { User } from "../users.schema";

@InputType()
export class CreateUserInput extends OmitType(
  User,
  ["isActive", "id", "createdAt", "updatedAt"],
  InputType,
) {
  @Field(() => String)
  @IsNotEmpty()
  confirmPassword: string;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
