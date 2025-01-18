import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisService } from 'src/service/redis.service';


@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'ORDER_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'order-service',
                        brokers: ['kafka:9092'],
                    },
                    consumer: {
                        groupId: 'order-service-group', // Đặt groupId duy nhất
                    },
                },
            },
        ]),
    ],
    controllers: [OrderController],
    providers: [OrderService, RedisService],
})
export class OrderModule { };