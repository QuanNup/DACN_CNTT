import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { AuthMiddleware } from './config/middleware/authMiddleware';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: true, // Cho phép frontend truy cập
    credentials: true, // Cho phép gửi cookie qua cross-origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Authorization', 'Content-Type'],
  });
  app.setGlobalPrefix('api/v1', { exclude: [''] });

  await app.listen(8080);
}
bootstrap();

// app.connectMicroservice<MicroserviceOptions>({
//   transport: Transport.KAFKA,
//   options: {
//     client: {
//       clientId: 'gateway-service',
//       brokers: ['kafka:9092'], // Đảm bảo hostname đúng
//     },
//     consumer: {
//       groupId: 'gateway-service-consumer', // GroupId duy nhất
//     },
//   },
// });
// await app.startAllMicroservices();
