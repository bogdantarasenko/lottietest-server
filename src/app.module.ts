import { join } from "path";
import { Module } from "@nestjs/common";
import { ApolloDriver } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as mongoosePaginate from "mongoose-paginate-v2";

import appConfig from "./config/app.config";
import authConfig from "./config/auth.config";
import fileConfig from "./config/file.config";
import databaseConfig from "./config/database.config";
import { AllConfigType } from "./config/config.type";

import { FilesModule } from "./files/files.module";
import { UsersModule } from "./users/users.module";
import { LottiesModule } from "./lotties/lottie.module";

@Module({
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
    FilesModule,
    GraphQLModule.forRootAsync({
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        playground: true,
        debug: configService.get("app").debug,
        autoSchemaFile: join(process.cwd(), "src/schema.gql"),
        installSubscriptionHandlers: true,
        uploads: true,
        subscriptions: {
          onConnect: (connectionParams: { Authorization: string }) => {
            const authorization = connectionParams.Authorization;
            return { authorization };
          },
        },
        context: ({ connection, req }) =>
          req ? req : { req: { headers: connection.context } },
      }),
    }),
    UsersModule,
    LottiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
