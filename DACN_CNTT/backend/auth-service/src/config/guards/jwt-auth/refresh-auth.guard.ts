import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "src/config/decorator/customize";



@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh-jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (info && info.name === 'TokenExpiredError') {
            throw new UnauthorizedException('Refresh đã hết hạn, vui lòng đăng nhập lại!');
        }
        if (err || !user) {
            throw err || new UnauthorizedException("Refresh Token không hợp lệ !");
        }
        return user;
    }
}