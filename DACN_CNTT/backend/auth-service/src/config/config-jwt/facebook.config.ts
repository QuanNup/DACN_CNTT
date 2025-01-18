import { registerAs } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export default registerAs('facebook', () => ({
    clientID: process.env.AUTH_FACEBOOK_ID,
    clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
    //callbackURL: 'http://localhost:8080/api/v1/auth/google/callback'
})
)