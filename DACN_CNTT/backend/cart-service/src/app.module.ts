import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCart } from './shopping-cart/typeorm/entities/shopping-cart.entities';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { ShoppingCartItem } from './shopping-cart/typeorm/entities/shopping-cart-iteams.entities';

@Module({
  imports: [
    ShoppingCartModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [ShoppingCart, ShoppingCartItem],
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
