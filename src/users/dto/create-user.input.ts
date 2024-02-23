import { IsNotEmpty, MinLength } from "class-validator";

import { InputType, OmitType } from "@nestjs/graphql";

import { User } from "../users.schema";

@InputType()
export class CreateUserInput extends OmitType(
  User,
  ["isActive", "id", "createdAt", "updatedAt"],
  InputType,
) {
  @IsNotEmpty()
  confirmPassword: string;

  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
