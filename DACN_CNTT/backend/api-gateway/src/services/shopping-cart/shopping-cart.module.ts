import { Module } from '@nestjs/common';
import { ShoppingCartController } from './shopping-cart.controller';
import { HttpModule } from '@nestjs/axios';


@Module({
    imports: [
        HttpModule,
    ],
    controllers: [ShoppingCartController],
    providers: [],
})
export class ShoppingCartModule { };