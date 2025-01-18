import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(
    {
      "origin": true,
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      credentials: true
    }
  );
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:9092'], // Địa chỉ Kafka broker
      },
      consumer: {
        groupId: 'product-service-consumer', // Group ID phải duy nhất
      },
    },
  });

  await app.startAllMicroservices();
  //app.useStaticAssets(join(__dirname, '..', '..', './uploads'));
  await app.listen(8082);
}
bootstrap();
