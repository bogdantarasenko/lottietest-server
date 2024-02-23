import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UsersModule } from "../users/users.module";
import { LottieLoader } from "./loaders/lottie.loader";
import { CommonModule } from "../common/common.module";
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
    CommonModule,
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
