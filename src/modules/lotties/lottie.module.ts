import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { FilesModule } from "../files/files.module";
import { UsersModule } from "../users/users.module";
import { LottieLoader } from "./lottie.loader";
import { LottiesService } from "./lotties.service";
import { LottieResolver } from "./lotties.resolver";
import { Lottie, LottieSchema } from "./lottie.schema";

@Module({
  providers: [
    LottieResolver,
    LottiesService,
    LottieLoader,
  ],
  imports: [
    FilesModule,
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Lottie.name,
        schema: LottieSchema,
      },
    ]),
  ],
})
export class LottiesModule {}
