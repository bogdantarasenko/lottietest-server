import {
  Args,
  Query,
  Parent,
  Resolver,
  Mutation,
  ResolveField,
} from "@nestjs/graphql";
// @ts-ignore
import { GraphQLUpload, FileUpload } from 'graphql-upload';

import { LottieLoader } from "./lottie.loader";
import { LottiesService } from "./lotties.service";
import { CurrentUser, Public } from "../auth/decorators";

// common
import { Pagination } from "../../common/pagination/pagination.type";
import { PaginationArgs } from "../../common/pagination/pagination.args";

// schema
import { User } from "../users/users.schema";
import { Lottie } from "./lottie.schema";

// dto
import { Success } from "./dto/success.type";
import { PaginatedLottie } from "./dto/lottie/lottie.type";
import { LottieIdInput } from "./dto/lottie/lottie-id.input";
import { LottieFilterInput } from "./dto/lottie/lottie-filter.input";
import { CreateLottieInput } from "./dto/lottie/create-lottie.input";
import { FilesService } from "../../modules/files/files.service";

@Resolver(() => Lottie)
export class LottieResolver {
  constructor(
    private readonly lottieLoader: LottieLoader,
    private readonly lottieService: LottiesService,
    private readonly fileUploadService: FilesService,
  ) { }

  @ResolveField(() => User)
  async author(@Parent() lottie: Lottie): Promise<User> {
    return this.lottieLoader.batchAuthors.load(lottie.author._id);
  }

  @Public()
  @Query(() => String, { description: "Check if the GraphQL endpoint is running" })
  async ping(): Promise<string> {
    return "pong";
  }

  @Public()
  @Query(() => [String], { description: "get all tags from lotties" })
  async getTags(): Promise<string[]> {
    return this.lottieService.getTags();
  }

  @Public()
  @Query(() => PaginatedLottie, { description: "get all lotties" })
  async getAll(
    @Args("input", { nullable: true }) input: PaginationArgs,
  ): Promise<Pagination<Lottie>> {
    const query: any = { };

    if (input.tags && input.tags.length) {
      query.tags = { $in: input.tags };
    }

    return this.lottieService.findAll(
      query,
      null,
      {},
      input.page,
      input.pageSize,
    );
  }

  @Query(() => PaginatedLottie, { description: "get my lotties" })
  async getMy(
    @CurrentUser() user: User,
    @Args("input", { nullable: true }) input: PaginationArgs,
  ): Promise<Pagination<Lottie>> {
    const query: any = { author: user._id };

    if (input.tags && input.tags.length) {
      query.tags = { $in: input.tags };
    }

    return this.lottieService.findAll(
      query,
      null,
      {},
      input.page,
      input.pageSize,
    );
  }

  @Query(() => Lottie, { description: "get by lottie id" })
  async getOne(
    @Args("filter") lottieGetInput: LottieFilterInput,
  ): Promise<Lottie> {
    return this.lottieService.findOne({ _id: lottieGetInput.id })
  }

  @Mutation(() => Lottie, { description: "create a new lottie" })
  async create(
    @Args({ name: "file", type: () => GraphQLUpload }) file: FileUpload,
    @Args("input") createLottieInput: CreateLottieInput,
    @CurrentUser() currentUser: User,
  ): Promise<Lottie> {
    return await this.lottieService.createWithUser(
      createLottieInput.tags,
      currentUser,
      file,
    );
  }

  @Mutation(() => Success, { description: "delete an existing lottie" })
  async delete(
    @Args("input") lottieDeleteInput: LottieIdInput,
    @CurrentUser() currentUser: User,
  ): Promise<Success> {
    // First, find the Lottie to ensure it exists and to get the author's ID
    const lottie = await this.lottieService.findOne({ _id: lottieDeleteInput.lottieId });
    if (!lottie) {
      throw new Error("Lottie not found");
    }

    // Check if the current user is the author of the Lottie
    if (lottie.author._id.toString() !== currentUser._id.toString()) {
      throw new Error("You are not authorized to delete this Lottie");
    }

    // If the check passes, proceed to delete the Lottie
    const success = await this.lottieService.delete({
      _id: lottieDeleteInput.lottieId,
    });

    await this.fileUploadService.deleteFile(lottie.path);

    return { success: success ? true : false };
  }
}
