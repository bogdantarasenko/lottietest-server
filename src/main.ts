import "source-map-support/register";
import * as mongoose from "mongoose";
import { json } from 'body-parser';
import { useContainer } from "class-validator";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { graphqlUploadExpress } from "graphql-upload";
import { NestFactory, Reflector } from "@nestjs/core";

import { AppModule } from "./app.module";
import { JwtAuthGuard } from "./auth/auth.guard";
import { AllConfigType } from "./config/config.type";
import { MongoErrorFilter } from "./common/mongo-error.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '5mb' }));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService<AllConfigType>);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new MongoErrorFilter());
  app.enableCors({
    origin: configService.get("app").frontendDomain,
    credentials: true,
  });
  app.use(
    graphqlUploadExpress({
      maxFiles: 5,
      maxFileSize: 500 * 1000,
      maxFieldSize: 500 * 1000,
    }),
  );
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));

  mongoose.set("debug", true);

  const server = await app.listen(configService.getOrThrow('app.port', { infer: true }));

  server.setTimeout(60 * 1000);
  server.keepAliveTimeout = 60 * 1000;
}
bootstrap();
