import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Kafka, Partitioners } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
    constructor(@Inject('PRODUCT_SERVICE') private readonly productClient: ClientKafka) { }

    // Gửi thông tin cập nhật sản phẩm qua Kafka
    async sendProductUpdate(productId: string, updatedData: any) {
        try {
            await this.productClient.send('product-updates', {
                productId,
                updatedData,
            });
            console.log(`Message sent to topic 'product-updates':`, { productId, updatedData });
        } catch (error) {
            console.error('Failed to send message to Kafka:', error.message);
        }
    }
}
