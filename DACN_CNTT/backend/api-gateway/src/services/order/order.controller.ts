import { Body, Controller, Get, HttpException, Post, Query, Req } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Controller('order')
export class OrderController {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService) { }

    @Post('create-order')
    async createOrder(@Req() req, @Body() createOrder: CreateOrderDto) {
        try {
            if (!createOrder.status) createOrder.status = 'PENDING';
            if (!createOrder.methodType) createOrder.methodType = 'credit_card';
            createOrder.user_id = req['user'].id;
            console.log(createOrder)
            const response = await lastValueFrom(
                this.httpService.post(`${this.configService.get<string>('URI_ORDER_SERVICE')}/order/create-order`,
                    createOrder
                )
            );
            return response.data
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error.response?.data || error);
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Post('update-order')
    async updateOrder(@Req() req, @Body() updateOrder: UpdateOrderDto) {
        try {
            if (!updateOrder.status) updateOrder.status = 'PENDING';
            updateOrder.user_id = req['user'].id;
            console.log(updateOrder.orderId, updateOrder)
            const response = await lastValueFrom(
                this.httpService.post(`${this.configService.get<string>('URI_ORDER_SERVICE')}/order/update-order`,
                    updateOrder
                )
            );
            return response.data
        } catch (error) {
            console.error('Lỗi khi cập nhật đơn hàng:', error.response?.data || error);
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }


    @Get('user-orders')
    async getUserOrders(@Req() req) {
        try {
            const user_id = req['user'].id
            const response = await lastValueFrom(
                this.httpService.get(`${this.configService.get<string>('URI_ORDER_SERVICE')}/order/user-orders?user_id=${user_id}`)
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