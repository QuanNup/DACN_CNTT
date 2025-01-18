import { registerAs } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export default registerAs('googleOAuth', () => ({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //callbackURL: process.env.GOOGLE_CALLBACK_URL
    callbackURL: 'http://localhost:8080/api/v1/auth/google/callback'
})
)