import { Controller, Post, Body, Get, Param, Patch, Inject } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('payments')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
        @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientKafka,
    ) { }

    async onModuleInit() {
        try {
            await this.paymentClient.connect();
            console.log('Connected to Kafka');
        } catch (error) {
            console.error('Error connecting to Kafka:', error);
        }
    }

    @MessagePattern('order.created')
    async handleOrderCreated(@Payload() message: any) {
        const payload = message;
        await this.paymentService.handleOrderCreated(payload);
    }

    @MessagePattern('order.updated')
    async handleOrderUpdate(@Payload() message: any) {
        const payload = message.value;
        await this.paymentService.handleOrderUpdated(payload);
    }
}
