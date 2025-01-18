import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { RedisService } from 'src/state/service/redis.service';
import { UsersModule } from '../management/users/users.module';
import jwtConfig from 'src/config/config-jwt/jwt.config';
import refreshJwtConfig from 'src/config/config-jwt/refresh.jwt.config';
import { JwtStrategy } from 'src/config/strategies/jwt.strategy';
import { LocalStrategy } from 'src/config/strategies/local.strategy';
import googleOAuthConfig from 'src/config/config-jwt/google-OAuth.config';
import { GoogleStrategy } from 'src/config/strategies/google.strategy';
import { FacebookStrategy } from 'src/config/strategies/facebook.strategy';
import facebookConfig from 'src/config/config-jwt/facebook.config';



@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(googleOAuthConfig),
    ConfigModule.forFeature(facebookConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RedisService, GoogleStrategy, FacebookStrategy],
})
export class AuthModule { }
