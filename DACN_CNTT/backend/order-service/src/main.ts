import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:9092'], // Địa chỉ Kafka broker
      },
      consumer: {
        groupId: 'order-service-consumer', // Group ID phải duy nhất
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(8086);
}
bootstrap();
