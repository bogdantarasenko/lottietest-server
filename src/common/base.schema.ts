import { ObjectId } from "mongoose";
import { ID, Field, HideField, ObjectType } from "@nestjs/graphql";

@ObjectType({ isAbstract: true })
export class BaseSchema {
  @Field(() => ID)
  readonly id?: string;

  @HideField()
  readonly _id?: ObjectId;

  @Field(() => Date)
  readonly createdAt: Date;

  @Field(() => Date)
  readonly updatedAt: Date;
}
