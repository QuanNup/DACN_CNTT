import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './typeorm/entities/payment.entities';
import { PaymentMethod } from './typeorm/entities/payment-method.entities';
import { Transaction } from './typeorm/entities/payment-transaction.entities';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentService } from './payment.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([Payment, PaymentMethod, Transaction]),
        ClientsModule.register([
            {
                name: 'PAYMENT_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'payment-service',
                        brokers: ['kafka:9092'],
                    },
                    consumer: {
                        groupId: 'payment-service-group', // Đặt groupId duy nhất
                    },
                },
            },
        ]),
    ],
    controllers: [PaymentController],
    providers: [PaymentService],
})
export class PaymentModule { };