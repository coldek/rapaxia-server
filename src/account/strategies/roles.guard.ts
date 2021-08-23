import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "src/db/entities/user/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const role = this.reflector.get<Role>('role', context.getHandler())

        if(!role) { return true }

        const {user} = context.switchToHttp().getRequest()

        return user.hasRole(role)
    }
}