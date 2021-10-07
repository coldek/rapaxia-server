import { UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) { super () }

    handleRequest(err, user, info, context) {
        const request = context.switchToHttp().getRequest()

        // Strict login is false. Protected routes make this true
        const allow = this.reflector.get<string[]>('strict-login', context.getHandler())

        if(user) return user

        // If it isn't a protected route just return null
        if(!allow) return null

        throw new UnauthorizedException()
    }
}