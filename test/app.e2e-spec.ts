import { ConfigModule, ConfigService } from "@nestjs/config";
import { graphqlUploadExpress } from "graphql-upload";
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { Reflector } from "@nestjs/core";
import mongoose from "mongoose";
import * as fs from 'fs';
import * as request from 'supertest';
import * as mongoosePaginate from "mongoose-paginate-v2";
import { AppModule } from './../src/app.module';

import { JwtAuthGuard } from "../src/modules/auth/auth.guard";
// config
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
          envFilePath: ['.env.test'],
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

    app.use(
      graphqlUploadExpress({
        maxFiles: 5,
        maxFileSize: 500 * 1000,
        maxFieldSize: 500 * 1000,
      }),
    );
    app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));

    await app.init();
  });

  afterAll(async () => {
    const connect = await mongoose.connect(process.env.DATABASE_URL)

    await connect.connection.db.dropDatabase();

    await connect.disconnect();

    await app.close();
  });

  describe('auth', () => {
    it('should register', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('content-type', 'application/json')
        .set('apollo-require-preflight', 'true')
        .send({
          query: `
          mutation {
            createUser(input: {
              email: "test@test.com",
              username: "test@test.com",
              password: "test@test.com",
              confirmPassword: "test@test.com"
            }) {
              email
              isActive
              username
            }
          }
        ` })
        .expect((res) => {
          expect(res.body.data.createUser).toEqual({
            "email": "test@test.com",
            "isActive": true,
            "username": "test@test.com"
          });
        });
    });
    it('should login and get current user', async () => {
      const email = "test@test.com";
      // Perform login to obtain the token
      const loginResponse = await request(app.getHttpServer())
        .post('/graphql')
        .set('content-type', 'application/json')
        .set('apollo-require-preflight', 'true')
        .send({
          query: `
              mutation {
                login(input: {
                  email: "${email}",
                  password: "${email}",
                }) {
                  token
                }
              }
            ` });

      return request(app.getHttpServer())
        .post('/graphql')
        .set('content-type', 'application/json')
        .set('apollo-require-preflight', 'true')
        .set('Authorization', `Bearer ${loginResponse.body.data.login.token}`)
        .send({
          query: `
            query {
              currentUser {
                email
              }
            }
        ` })
        .expect((res) => {
          expect(res.body.data.currentUser.email).toBe(email);
        });
    });
  });
  describe('lottie', () => {
    it('should create a new lottie', async () => {
      const email = "test@test.com";
      // Perform login to obtain the token
      const loginResponse = await request(app.getHttpServer())
        .post('/graphql')
        .set('content-type', 'application/json')
        .set('apollo-require-preflight', 'true')
        .send({
          query: `
          mutation {
            login(input: {
              email: "${email}",
              password: "${email}",
            }) {
              token
            }
          }
        `
        });

      // Set up variables for the mutation
      const file = fs.readFileSync('./test/mock.json');
      const fileBlob = new Blob([file], { type: 'application/json' });
      const variables = {
        file: null,
        input: {
          tags: ["tag1", "tag2"]
        }
      };

      // Create FormData object and append file
      const formData = new FormData();
      formData.append('operations', JSON.stringify({
        query: `mutation ($file: Upload!, $input: CreateLottieInput!) {
        create(file: $file, input: $input) {
          id
          createdAt
          updatedAt
          tags
          path
          author {
            id
            username
          }
        }
      }`,
        variables: {
          file: null,
          input: variables.input
        }
      }));
      formData.append('map', JSON.stringify({ "0": ["variables.file"] }));
      formData.append('0', fileBlob, 'lottie.json');

      // Perform the mutation request with the token and form data
      return request(app.getHttpServer())
        .post('/graphql')
        .set('apollo-require-preflight', 'true')
        .set('Authorization', `Bearer ${loginResponse.body.data.login.token}`)
        .field('operations', JSON.stringify({
          query: `mutation ($file: Upload!, $input: CreateLottieInput!) {
          create(file: $file, input: $input) {
            id
            createdAt
            updatedAt
            tags
            path
            author {
              id
              username
            }
          }
        }`,
          variables
        }))
        .field('map', JSON.stringify({ "0": ["variables.file"] }))
        .attach('0', file, 'lottie.json')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.create.id).toBeDefined();
          expect(res.body.data.create.author.username).toBe("test@test.com");
        });
    });
    it('should query public tags', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('content-type', 'application/json')
        .set('apollo-require-preflight', 'true')
        .send({ query: "query { getTags }" })
        .expect((res) => {
          expect(res.body.data.getTags).toHaveLength(2);
        });
    });
    it('should query public lotties', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('content-type', 'application/json')
        .set('apollo-require-preflight', 'true')
        .send({
          query: `
        query {
          getAll(input: {page: 1, pageSize: 8, tags: []}) {
            results {
              author {
                email
              }
            }
          }
        }
      ` })
        .expect((res) => {
          expect(res.body.data.getAll.results).toHaveLength(1);
        });
    });
    it('should query private lotties', async () => {
      const email = "test@test.com";
      // Perform login to obtain the token
      const loginResponse = await request(app.getHttpServer())
        .post('/graphql')
        .set('content-type', 'application/json')
        .set('apollo-require-preflight', 'true')
        .send({
          query: `
        mutation {
          login(input: {
            email: "${email}",
            password: "${email}",
          }) {
            token
          }
        }
      ` });

      // Use the token in the request for private lotties
      return request(app.getHttpServer())
        .post('/graphql')
        .set('content-type', 'application/json')
        .set('apollo-require-preflight', 'true')
        .set('Authorization', `Bearer ${loginResponse.body.data.login.token}`)
        .send({
          query: `
          query {
            getMy(input: {page: 1, pageSize: 8, tags: []}) {
              results {
                author {
                  email
                }
              }
            }
          }
      `})
        .expect((res) => {
          expect(res.body.data.getMy.results).toHaveLength(1);
        });
    });
    it('should delete lottie', async () => {
      const email = "test@test.com";
      // Perform login to obtain the token
      const loginResponse = await request(app.getHttpServer())
        .post('/graphql')
        .set('content-type', 'application/json')
        .set('apollo-require-preflight', 'true')
        .send({
          query: `
            mutation {
              login(input: {
                email: "${email}",
                password: "${email}",
              }) {
                token
              }
            }
          ` });

      // get user lotties
      const userLotties = await request(app.getHttpServer())
        .post('/graphql')
        .set('content-type', 'application/json')
        .set('apollo-require-preflight', 'true')
        .set('Authorization', `Bearer ${loginResponse.body.data.login.token}`)
        .send({
          query: `
          query {
            getMy(input: {page: 1, pageSize: 8, tags: []}) {
              results {
                id
              }
            }
          }
      ` });

      const lottieId = userLotties.body.data.getMy.results[0].id;

      // delete lottie by id
      return request(app.getHttpServer())
        .post('/graphql')
        .set('content-type', 'application/json')
        .set('apollo-require-preflight', 'true')
        .set('Authorization', `Bearer ${loginResponse.body.data.login.token}`)
        .send({
          query: `
          mutation {
            delete(input: { lottieId: "${lottieId}"}) {
              success
            }
          }
      `})
        .expect((res) => {
          expect(res.body.data.delete.success).toBeTruthy();
        });
    });
  });
});

