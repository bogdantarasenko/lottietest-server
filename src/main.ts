import "source-map-support/register";
import * as mongoose from "mongoose";
import { join } from "path";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { graphqlUploadExpress } from "graphql-upload";
import { NestFactory, Reflector } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "./app.module";
import { JwtAuthGuard } from "./auth/auth.guard";
import { MongoErrorFilter } from "./common/mongo-error.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.useStaticAssets(join(__dirname, "..", "static"));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new MongoErrorFilter());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.use(
    graphqlUploadExpress({
      maxFiles: 5,
      maxFileSize: 500 * 1000,
      maxFieldSize: 500 * 1000,
    }),
  );
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  mongoose.set("debug", true);
  const server = await app.listen(configService.get<number>("SERVER_PORT"));
  server.setTimeout(60 * 1000);
  server.keepAliveTimeout = 60 * 1000;
}
bootstrap();
