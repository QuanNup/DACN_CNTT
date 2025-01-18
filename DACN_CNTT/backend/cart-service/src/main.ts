import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'cart-service',
        brokers: ['kafka:9092'], // Đảm bảo hostname đúng
      },
      consumer: {
        groupId: 'cart-service-consumer', // GroupId duy nhất
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(8084);
}
bootstrap();
