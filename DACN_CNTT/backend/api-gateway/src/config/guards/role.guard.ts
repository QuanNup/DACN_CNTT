import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY, ROLES_KEY } from "src/config/decorator/customize";
import { Role } from "src/config/enum/role";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublicEndPoint = this.reflector.getAllAndOverride<Boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        const requireRole = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requireRole) {
            return true;
        }

        if (isPublicEndPoint) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        console.log(user.role)
        const isValidation = requireRole.some(role => user.role.includes(role))
        if (!isValidation) {
            throw new ForbiddenException("Unauthorized")
        }
        return true;
        ;
    }
}