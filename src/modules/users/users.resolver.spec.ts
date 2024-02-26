import { Test, TestingModule } from "@nestjs/testing";
import { UsersResolver } from "./users.resolver";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../auth/auth.module";
import { MongooseTestModule } from "../../common/mongoose-testing.module";
// config
import appConfig from "../../config/app.config";
import authConfig from "../../config/auth.config";
import fileConfig from "../../config/file.config";
import databaseConfig from "../../config/database.config";

describe("UsersResolver", () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
      imports: [
        AuthModule,
        MongooseTestModule(),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            appConfig,
            authConfig,
            fileConfig,
            databaseConfig,
          ],
          envFilePath: ['.env'],
        }),
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });


  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
