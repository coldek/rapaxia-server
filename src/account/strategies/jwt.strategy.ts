import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Config } from "src/config";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: Config.secretKey,
            algorithms: ['RS256']
        })

        console.log(ExtractJwt.fromAuthHeaderAsBearerToken())
    }

    async validate(payload: any) {
        // Get user from token
        console.log(payload)

        return this.usersService.findOne({ token: payload.sub })
    }
}