import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { ValidatePasswordPipe } from "./pipes/validate-password.pipe";
import { CreateUserInput } from "./dto/create-user.input";
import { User } from "./users.schema";
import { Public } from "../auth/decorators";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => User, { description: "create a new user" })
  @Public()
  async createUser(
    @Args("input", new ValidatePasswordPipe())
    createUserInputType: CreateUserInput,
  ) {
    return this.userService.create(createUserInputType);
  }
}
