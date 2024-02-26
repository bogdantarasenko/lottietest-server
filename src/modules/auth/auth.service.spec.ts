import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users/users.service";
import { ConfigModule } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthModule } from "./auth.module";
import {
  closeMongoConnection,
  MongooseTestModule,
} from "../../common/mongoose-testing.module";
// config
import appConfig from "../../config/app.config";
import authConfig from "../../config/auth.config";
import fileConfig from "../../config/file.config";
import databaseConfig from "../../config/database.config";

let authService: AuthService;

const EMAIL = "Ramzi@test.com";
const PASSWORD = "password";

describe("AuthService", () => {
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

    authService = module.get<AuthService>(AuthService);
    const userService = module.get<UsersService>(UsersService);
    await userService.create({
      username: "test",
      email: EMAIL,
      password: PASSWORD,
      confirmPassword: PASSWORD,
    });
  });

  it("should return true if log in success", async () => {
    const isLogged = await authService.validateUser(EMAIL, PASSWORD);
    expect(isLogged).toBeTruthy();
  });

  it("should return false if log in failed", async () => {
    const isLogged = await authService.validateUser(EMAIL, "q343");
    expect(isLogged).toBeFalsy();
  });

  afterAll(() => closeMongoConnection());
});
