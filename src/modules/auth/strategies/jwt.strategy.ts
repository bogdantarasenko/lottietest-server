import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { JWTPayload } from "../jwt-payload.interface";
import { UsersService } from "../../users/users.service";
import { User } from "../../users/users.schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      usernameField: "email",
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("auth").secret,
    });
  }

  async validate(payload: JWTPayload): Promise<User> {
    return this.userService.findOne({ _id: payload.id });
  }
}
