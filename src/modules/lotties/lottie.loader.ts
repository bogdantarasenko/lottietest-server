import * as DataLoader from "dataloader";
import { ObjectId } from "mongoose";
import { Injectable, Scope } from "@nestjs/common";
import { User } from "../users/users.schema";
import { Mapper } from "../../common/mapper";
import { UsersService } from "../users/users.service";

@Injectable({ scope: Scope.REQUEST })
export class LottieLoader {
  authorsMapper = new Mapper<User>();

  constructor(
    private readonly userService: UsersService,
  ) {}

  public readonly batchAuthors = new DataLoader<ObjectId, User>(
    async (authorIds: ObjectId[]) => {
      const authors = await this.userService.findByIds(authorIds);
      return this.authorsMapper.mapObjectsToId(authors, authorIds);
    },
  );
}
