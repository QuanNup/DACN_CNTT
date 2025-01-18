import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { OrderModule } from './order/order.module';
import { RedisService } from './service/redis.service';

@Module({
  imports: [
    RedisModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule { }
