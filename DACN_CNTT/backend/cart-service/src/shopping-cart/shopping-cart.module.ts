import { Module } from '@nestjs/common';
import { ShoppingCartController } from './shopping-cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCart } from './typeorm/entities/shopping-cart.entities';
import { ShoppingCartItem } from './typeorm/entities/shopping-cart-iteams.entities';
import { ShoppingCartService } from './shopping-cart.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        TypeOrmModule.forFeature([ShoppingCart, ShoppingCartItem]),
        // ClientsModule.register([
        //     {
        //         name: 'CART_SERVICE',
        //         transport: Transport.KAFKA,
        //         options: {
        //             client: {
        //                 clientId: 'cart-service',
        //                 brokers: ['kafka:9092'],
        //             },
        //             consumer: {
        //                 groupId: 'cart-service-consumer',
        //             },
        //         },
        //     },
        // ]),
    ],
    controllers: [ShoppingCartController],
    providers: [ShoppingCartService],
})
export class ShoppingCartModule { };