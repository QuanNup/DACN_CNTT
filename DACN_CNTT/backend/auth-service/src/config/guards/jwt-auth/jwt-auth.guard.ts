
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { RedisService } from 'src/state/service/redis.service';
import { lastValueFrom, Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/config/decorator/customize';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers['authorization'];
        if (!authorizationHeader) {
            throw new UnauthorizedException('Authorization header missing');
        }
        const token = authorizationHeader.split(' ')[1];
        return this.redisService.isTokenBlacklisted(token).then(isBlacklisted => {
            if (isBlacklisted) {
                throw new UnauthorizedException('Token is blacklisted');
            }
            const result = super.canActivate(context);
            if (result instanceof Observable) {
                return lastValueFrom(result);
            }
            return result;
        });
    }

    handleRequest(err, user, info) {
        if (info && info.name === 'TokenExpiredError') {
            throw new UnauthorizedException('Token đã hết hạn, vui lòng làm mới token!');
        }
        if (err || !user) {
            throw err || new UnauthorizedException("Access Token không hợp lệ !");
        }
        return user;
    }
}
