import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { FilesModule } from "../files/files.module";
import { UsersModule } from "../users/users.module";
import { LottieLoader } from "./loaders/lottie.loader";
import { LottiesService } from "./services/lotties.service";
import { LottieResolver } from "./resolvers/lotties.resolver";
import { Lottie, LottieSchema } from "./schemas/lottie.schema";

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
