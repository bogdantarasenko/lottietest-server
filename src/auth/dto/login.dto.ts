import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/users.schema";

@InputType()
export class LoginInputType {
  email: string;
  password: string;
}

@ObjectType()
export class JWTTokenResponseType {
  @Field(() => String, { nullable: true })
  token?: string;

  @Field(() => Boolean)
  success: boolean;

  @Field(() => User, { nullable: true })
  user?: User;
}