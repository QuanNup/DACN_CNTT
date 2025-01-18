import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';


@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post('create-order')
    async createOrder(@Body() createOrder: CreateOrderDto) {
        return await this.orderService.createOrder(createOrder)
    }

    @Post('update-order')
    async updateOrderOrder(
        @Body() updateOrder: UpdateOrderDto) {
        return await this.orderService.updateOrder(updateOrder)
    }

    @Get('user-orders')
    async getUserOrders(@Query('user_id') user_id: string) {
        return await this.orderService.getOrderByUserId(user_id)
    }
}
