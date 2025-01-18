import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import googleOAuthConfig from "../config-jwt/google-OAuth.config";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { VerifiedCallback } from "passport-jwt";
import { AuthService } from "src/modules/auth/auth.service";
import { AccountType } from "src/modules/management/users/entities/user.entities";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(googleOAuthConfig.KEY)
        private googleConfiguration: ConfigType<typeof googleOAuthConfig>,
        private authService: AuthService
    ) {
        super({
            clientID: googleConfiguration.clientID,
            clientSecret: googleConfiguration.clientSecret,
            callbackURL: googleConfiguration.callbackURL,
            scope: ['email', 'profile']
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ) {
        const user = await this.authService.validateGoogleUser({
            email: profile.emails[0].value,
            name: profile.displayName,
            image: profile.photos[0].value,
            password: '',
            phone: '',
            address: '',
            isActive: true,
            role: [],
            accountType: AccountType.GOOGLE
        });
        return user
        //return user;
    }
}