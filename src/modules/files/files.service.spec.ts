import * as fs from 'fs';
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { FilesModule } from "./files.module";
import { FilesService } from "./files.service";
import { closeMongoConnection, MongooseTestModule } from "../../common/mongoose-testing.module";
// config
import appConfig from "../../config/app.config";
import authConfig from "../../config/auth.config";
import fileConfig from "../../config/file.config";
import databaseConfig from "../../config/database.config";

let filesService: FilesService;

describe("FilesService", () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
      imports: [
        FilesModule,
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

    filesService = module.get<FilesService>(FilesService);
  });

  afterAll(() => closeMongoConnection());

  it('should upload and delete a file locally', async () => {
    const fileContent = fs.readFileSync('./test/mock.json');
    const fileMock = {
      filename: 'mock.json',
      createReadStream: () => fileContent
    };

    const fileName = await filesService.saveFile(fileMock);

    expect(fileName).toBeDefined();
    expect(fileName.endsWith('.json')).toBeTruthy();

    await filesService.deleteFile(fileName);

    try {
      fs.accessSync(fileName);
      fail('File should have been deleted');
    } catch (error) {
      expect(error.code).toBe('ENOENT');
    }
  });
});
