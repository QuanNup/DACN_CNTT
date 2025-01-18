import { MiddlewareConsumer, Module, NestMiddleware, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './services/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { TransformInterceptor } from './config/core/transform.interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './config/middleware/authMiddleware';
import { HttpModule } from '@nestjs/axios';
import { IdempotencyMiddleWare } from './config/middleware/idempotency.middleware';
import { RedisService } from './config/service/redis.service';
import { RedisModule } from './redis/redis.module';
import { StoreModule } from './services/store/store.module';
import { RolesGuard } from './config/guards/role.guard';
import { AdminGlobalModule } from './AdminGlobal/admin-global.module';
import { ProductModule } from './services/product/product.module';
import { SearchModule } from './services/search/search.module';
import { ShoppingCartModule } from './services/shopping-cart/shopping-cart.module';
import { OrderModule } from './services/order/order.module';



@Module({
  imports: [
    OrderModule,
    ShoppingCartModule,
    SearchModule,
    StoreModule,
    AuthModule,
    ProductModule,
    AdminGlobalModule,
    PassportModule,
    HttpModule,
    RedisModule,
    ConfigModule.forRoot({ isGlobal: true }),
    // ClientsModule.register([
    //   {
    //     name: 'BILLING_SERVICE',
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         brokers: ['localhost:9092'],
    //       },
    //       consumer: {
    //         groupId: 'billing-consumer',
    //       }
    //     }
    //   }
    // ]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true, // Đảm bảo rằng JwtModule được cấu hình toàn cục
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Reflector,
    RedisService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
  ],
  exports: [RedisService]
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/refresh-token', method: RequestMethod.POST },
        { path: 'auth/active-user', method: RequestMethod.POST },
        { path: 'auth/retry-password', method: RequestMethod.POST },
        { path: 'auth/change-password', method: RequestMethod.POST },
        { path: 'auth/verify-code', method: RequestMethod.POST },
        { path: 'auth/retry-active', method: RequestMethod.POST },
        { path: 'auth/google/login', method: RequestMethod.GET },
        { path: 'auth/google/callback', method: RequestMethod.GET },
        { path: 'auth/facebook/login', method: RequestMethod.GET },
        { path: 'auth/facebook/callback', method: RequestMethod.GET },
        { path: 'auth/uploads/:userId/:userImage', method: RequestMethod.GET },
        { path: '/', method: RequestMethod.GET },
        { path: 'store/get-store-by-id', method: RequestMethod.POST },
        //{ path: 'products/*', method: RequestMethod.GET }
      )
      .forRoutes('*'); // Đăng ký middleware,

    // consumer
    //   .apply(IdempotencyMiddleWare)
    //   .forRoutes("*");
  }
}

