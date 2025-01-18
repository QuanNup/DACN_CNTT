import { Body, Controller, Delete, Get, Inject, Post, Req } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateShoppingCartDto } from './dto/update-shopping-cart.dto';

@Controller('shopping-cart')
export class ShoppingCartController {
    constructor(
        private readonly shoppingCartService: ShoppingCartService,
        //@Inject('CART_SERVICE') private readonly clientKafka: ClientKafka,
    ) {
        //this.clientKafka.connect();
    }

    @Post('get-all-shopping-cart')
    async getAllShoppingCart(@Body('userId') userId: string) {
        return await this.shoppingCartService.getAllByUserId(userId)
    }

    @Post('add-to-cart')
    async createShoppingCart(@Body() createShoppingCartDto: CreateShoppingCartDto) {
        return await this.shoppingCartService.createShoppingcart(createShoppingCartDto);
    }

    @Post('update-cart')
    async updateShoppingCart(
        @Body() updateShoppingCartDto: UpdateShoppingCartDto
    ) {
        return await this.shoppingCartService.updateShoppingcart(updateShoppingCartDto);
    }

    @Delete('delete-cart-item')
    async deleteCartItem(@Body() body: { user_id: string, item_id: string[] }) {
        console.log(body.item_id)
        return await this.shoppingCartService.deleteCartItem(body.user_id, body.item_id)
    }

    @MessagePattern('product-updates')
    async handleProductUpdate(@Payload() message: any) {
        console.log('Raw message received:', message);
        try {
            const productUpdate = message
            console.log('Parsed product update:', productUpdate);

            const { productId, updatedData } = productUpdate;
            await this.shoppingCartService.updateCartItems(productId, updatedData);
        } catch (error) {
            console.error('Failed to process product update:', error.message);
        }
    }

}