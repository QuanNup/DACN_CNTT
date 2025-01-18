import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import * as dotenv from 'dotenv'

dotenv.config()


@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST, 
          port: parseInt(process.env.REDIS_PORT,10), 
          db:0,  
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}