import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { LottiesModule } from "./lottie.module";
import { AuthModule } from "../auth/auth.module";
import { FilesModule } from "../files/files.module";
import { LottieResolver } from "./lotties.resolver";
import { MongooseTestModule } from "../../common/mongoose-testing.module";
// config
import appConfig from "../../config/app.config";
import authConfig from "../../config/auth.config";
import fileConfig from "../../config/file.config";
import databaseConfig from "../../config/database.config";

describe("LottieResolver", () => {
  let resolver: LottieResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        FilesModule,
        LottiesModule,
        MongooseTestModule(),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, authConfig, fileConfig, databaseConfig],
          envFilePath: ['.env.test'],
        }),
      ],
      providers: [],
    }).compile();

    resolver = module.get<LottieResolver>(LottieResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

  it("should return an array of tags", async () => {
    const tags = ["tag1", "tag2"];
    jest.spyOn(resolver, "getTags").mockResolvedValue(tags);

    const result = await resolver.getTags();

    expect(result).toEqual(tags);
  });
});
