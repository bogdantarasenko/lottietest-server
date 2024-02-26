import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./users.schema";
import { UsersResolver } from "./users.resolver";
import { UsersService } from "./users.service";
import { AuthModule } from "../auth/auth.module";
import { FilesModule } from "../files/files.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    FilesModule,
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
