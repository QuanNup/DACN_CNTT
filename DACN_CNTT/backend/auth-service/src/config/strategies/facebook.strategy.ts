import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import facebookConfig from '../config-jwt/facebook.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from 'src/modules/auth/auth.service';
import { AccountType } from 'src/modules/management/users/entities/user.entities';
type VerifyCallback = (error: any, user?: any, info?: any) => void;
@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(facebookConfig.KEY)
        private facebookConfiguration: ConfigType<typeof facebookConfig>,
        private authService: AuthService
    ) {
        super({
            clientID: facebookConfiguration.clientID,
            clientSecret: facebookConfiguration.clientSecret,
            callbackURL: facebookConfiguration.callbackURL,
            profileFields: ['id', 'emails', 'name', 'photos'], // Lấy dữ liệu từ Facebook
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ) {
        const user = await this.authService.validateFacebookUser({
            email: `${profile.id}@facebook.com`,
            name: `${profile?.name?.familyName || null} ${profile?.name?.givenName || null}`,
            image: profile?.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
            password: '',
            phone: '',
            address: '',
            isActive: true,
            role: [],
            accountType: AccountType.FACEBOOK
        });
        return user
    }
}
