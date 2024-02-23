import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  pageSize?: number;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}
