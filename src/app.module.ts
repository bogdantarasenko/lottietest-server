import { join } from "path";
import { Module } from "@nestjs/common";
import { ApolloDriver } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as mongoosePaginate from "mongoose-paginate-v2";

import { UsersModule } from "./users/users.module";
import { LottiesModule } from "./lotties/lottie.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
        connectionFactory: (connection) => {
          connection.plugin(mongoosePaginate);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync({
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: (config: ConfigService) => ({
        playground: true,
        debug: config.get<boolean>("DEBUG"),
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
