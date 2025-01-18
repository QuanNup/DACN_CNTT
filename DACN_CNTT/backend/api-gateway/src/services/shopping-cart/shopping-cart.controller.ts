import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Get, HttpException, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping-cart.dto';

@Controller('shopping-cart')
export class ShoppingCartController {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }

    @Post('add-to-cart')
    async addToCart(@Req() req, @Body() createShoppingCartDto: CreateShoppingCartDto) {
        try {
            createShoppingCartDto.user_id = req['user'].id;
            const response = await lastValueFrom(
                this.httpService.post(`${this.configService.get<string>('URI_CART_SERVICE')}/shopping-cart/add-to-cart`, createShoppingCartDto)
            );
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Post('update-cart')
    async updateCart(@Req() req, @Body() updateShoppingCartDto: UpdateShoppingCartDto) {
        try {
            updateShoppingCartDto.user_id = req['user'].id;
            const response = await lastValueFrom(
                this.httpService.post(`${this.configService.get<string>('URI_CART_SERVICE')}/shopping-cart/update-cart`, updateShoppingCartDto)
            );
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }


    @Delete('delete-cart-item')
    async deleteCartItem(@Body() body: { items: { item_id: string }[] }, @Req() req) {
        try {
            console.log(body)
            const user_id = req['user'].id;
            const item_ids = body.items.map(item => item.item_id);
            if (item_ids.length === 0) {
                throw new HttpException('No item IDs provided', 400);
            }

            console.log('Item IDs to delete:', item_ids);
            const response = await lastValueFrom(
                this.httpService.delete(`${this.configService.get<string>('URI_CART_SERVICE')}/shopping-cart/delete-cart-item`,
                    {
                        data: { user_id, item_id: item_ids }
                    })
            );
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }


    @Get('get-all-shopping-cart')
    async getAllShoppingCart(@Req() req) {
        try {
            const userId = req['user'].id
            const response = await lastValueFrom(
                this.httpService.post(`${this.configService.get<string>('URI_CART_SERVICE')}/shopping-cart/get-all-shopping-cart`, { userId })
            );
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }
}