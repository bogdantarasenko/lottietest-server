import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import * as request from 'supertest';
import * as mongoosePaginate from "mongoose-paginate-v2";
import { AppModule } from './../src/app.module';
// // config
import appConfig from "../src/config/app.config";
import authConfig from "../src/config/auth.config";
import fileConfig from "../src/config/file.config";
import databaseConfig from "../src/config/database.config";
import { AllConfigType } from "../src/config/config.type";

describe('GraphQL Server (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
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
        MongooseModule.forRootAsync({
          useFactory: async (configService: ConfigService<AllConfigType>) => ({
            uri: configService.get("database").url,
            connectionFactory: (connection) => {
              connection.plugin(mongoosePaginate);
              return connection;
            },
          }),
          inject: [ConfigService],
        }),
        AppModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('users', () => {
    it('should query getAll and return 8 lotties', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('content-type', 'application/json')
        .set('apollo-require-preflight', 'true')
        .send({ query: "query {  ping }" })
        .expect((res) => {
          expect(res.body.data.ping).toBe("pong");
        });
    });
  });
});
