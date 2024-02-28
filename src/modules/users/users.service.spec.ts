import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";
import { AuthModule } from "../auth/auth.module";
import {
  closeMongoConnection,
  MongooseTestModule,
} from "../../common/mongoose-testing.module";
import appConfig from "../../config/app.config";
import authConfig from "../../config/auth.config";
import fileConfig from "../../config/file.config";
import databaseConfig from "../../config/database.config";

describe("UserService", () => {
  let userService: UsersService;

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
          envFilePath: ['.env.test'],
        }),
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  afterAll(() => closeMongoConnection());

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = {
        email: 'john@example.com',
        username: 'John Doe',
        password: 'password123',
        confirmPassword: 'password123',
      };
      const createdUser = await userService.create(newUser);

      expect(createdUser).toHaveProperty('_id');
      expect(createdUser.email).toBe(newUser.email);
      expect(createdUser.username).toBe(newUser.username);
    });
  });
});
