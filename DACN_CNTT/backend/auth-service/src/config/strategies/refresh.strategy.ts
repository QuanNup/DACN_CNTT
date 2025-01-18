import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import refreshJwtConfig from '../config-jwt/refresh.jwt.config';
import { AuthJwtPayload } from '../types/auth-jwtPayload';


@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
    constructor(
        @Inject(refreshJwtConfig.KEY)
        private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: refreshJwtConfiguration.secret,
        });
    }

    async validate(payload: AuthJwtPayload) {
        return { _id: payload.sub };
    }
}