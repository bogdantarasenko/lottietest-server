import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthResolver } from "./auth.resolver";
import { JwtAuthGuard } from "./auth.guard";
import { AllConfigType } from "src/config/config.type";

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService<AllConfigType>) => ({
        secret: config.get("auth").secret,
        signOptions: { expiresIn: "1d" },
      }),
    }),
  ],
  exports: [AuthService],
  providers: [AuthService, JwtStrategy, AuthResolver, JwtAuthGuard],
})
export class AuthModule {}
