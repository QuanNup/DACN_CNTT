import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment/typeorm/entities/payment.entities';
import { PaymentMethod } from './payment/typeorm/entities/payment-method.entities';
import { Transaction } from './payment/typeorm/entities/payment-transaction.entities';

@Module({
  imports: [
    PaymentModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Payment, PaymentMethod, Transaction],
      synchronize: true,
      extra: {
        trustServerCertificate: true,
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
