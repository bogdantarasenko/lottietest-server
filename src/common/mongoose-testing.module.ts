import { MongooseModule, MongooseModuleOptions } from "@nestjs/mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer;

export const MongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create();
      const mongoUri = await mongod.getUri();
      return {
        uri: mongoUri,
        ...options,
      };
    },
  });

export const closeMongoConnection = async () => {
  if (mongod) await mongod.stop();
};
