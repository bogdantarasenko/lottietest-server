import * as fs from 'fs';
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { LottiesModule } from "./lottie.module";
import { AuthModule } from "../auth/auth.module";
import { FilesModule } from "../files/files.module";
import { MongooseTestModule } from "../../common/mongoose-testing.module";
// config
import appConfig from "../../config/app.config";
import authConfig from "../../config/auth.config";
import fileConfig from "../../config/file.config";
import databaseConfig from "../../config/database.config";
// services
import { FilesService } from "../files/files.service";
import { UsersService } from "../users/users.service";
import { LottiesService } from "./lotties.service";

describe("LottieResolver", () => {
  let userService: UsersService;
  let filesService: FilesService;
  let lottiesService: LottiesService;

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

    lottiesService = module.get<LottiesService>(LottiesService);
    filesService = module.get<FilesService>(FilesService);
    userService = module.get(UsersService);
  });

  it("should be defined", () => {
    expect(lottiesService).toBeDefined();
  });

  it("should create a lottie and get tags", async () => {
    const tags = ["tag1", "tag2"];
    const user = await userService.create({
      email: "ramzi@gmail.com",
      username: "ramzi",
      password: "ramzi",
      confirmPassword: "ramzi",
    });
    const fileContent = fs.readFileSync('./test/mock.json');
    const fileMock = {
      filename: 'mock.json',
      createReadStream: () => fileContent
    };

    const createdLottie = await lottiesService.createWithUser(tags, user, fileMock);

    expect(createdLottie).toHaveProperty('_id');

    const getTagsResult = await lottiesService.getTags();

    expect(getTagsResult).toEqual(tags);

    await filesService.deleteFile(createdLottie.path);

    try {
      fs.accessSync(createdLottie.path);
      fail('File should have been deleted');
    } catch (error) {
      expect(error.code).toBe('ENOENT');
    }
  });
});
