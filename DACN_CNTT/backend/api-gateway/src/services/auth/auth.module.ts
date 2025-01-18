import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { RedisService } from 'src/config/service/redis.service';
import { RedisModule } from 'src/redis/redis.module';


@Module({
    imports: [
        HttpModule,
        RedisModule,
        // ClientsModule.register([
        //     {
        //         name: 'AUTH_SERVICE',
        //         transport: Transport.KAFKA,
        //         options: {
        //             client: {
        //                 clientId: 'auth-service',
        //                 brokers: ['localhost:9092'],
        //             },
        //             consumer: {
        //                 groupId: 'auth-service-consumer',
        //             },
        //         },
        //     },
        // ]),

    ],
    controllers: [AuthController],
    providers: [RedisService],
})
export class AuthModule { }
