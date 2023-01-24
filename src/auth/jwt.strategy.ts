import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
// import { Strategy } from "passport-local";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET1'
    })
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      name: payload.name
    }
  }
}