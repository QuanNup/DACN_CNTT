import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser'
import { DataSource } from 'typeorm';
import { seedDatabase } from './config/seed';
async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigService);
  // const port = configService.get('PORT');
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,
  //   forbidNonWhitelisted: true,
  // }));
  // app.setGlobalPrefix('api/v1', { exclude: [''] });
  // //config cors 
  // app.enableCors(
  //   {
  //     "origin": true,
  //     "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  //     "preflightContinue": false,
  //     credentials: true
  //   }
  // );
  // await app.listen(port);
  const app = await NestFactory.create(AppModule);
  app.enableCors(
    {
      "origin": true,
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      credentials: true
    }
  );
  app.use(cookieParser());

  // const dataSource = app.get(DataSource);

  // // Seed database với vai trò và quyền mặc định
  // await seedDatabase(dataSource);
  await app.listen(8081);

  // HTTP server on port 3000
  // const kafkaApp = await NestFactory.createMicroservice(AppModule, {
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       clientId: 'auth-service',
  //       brokers: ['localhost:9092'],
  //     },
  //     consumer: {
  //       groupId: 'auth-service-consumer',
  //     },
  //   },
  // });
  // await kafkaApp.listen();
}
bootstrap();
