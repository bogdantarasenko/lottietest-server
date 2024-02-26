import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { AuthService } from "../auth/auth.service";

import { CrudService } from "../../common/services/crud.service";
import { User, UserDocument } from "./users.schema";

import { CreateUserInput } from "./dto/create-user.input";

@Injectable()
export class UsersService extends CrudService<
  User,
  CreateUserInput
> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
    super(userModel);
  }

  async create(createDto: CreateUserInput): Promise<User> {
    createDto.password = await this.authService.createPassword(
      createDto.password,
    );
    delete createDto.confirmPassword;
    const newUser = { ...createDto, isActive: true } as any;

    const user = new this.userModel(newUser);

    await user.save();

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return await super.findOne({ email });
  }
}
