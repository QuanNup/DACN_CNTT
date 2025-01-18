import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { ClientKafka } from '@nestjs/microservices';
import * as dayjs from "dayjs";
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { RedisService } from 'src/service/redis.service';
import { randomUUID } from 'crypto';

dayjs.extend(utc)
dayjs.extend(timezone)
@Injectable()
export class OrderService {
    constructor(
        @Inject('ORDER_SERVICE') private readonly kafkaClient: ClientKafka,
        private readonly redisService: RedisService,
    ) {
        this.kafkaClient.connect();
    }

    async createOrder(createOrderDto: CreateOrderDto) {

        if (!createOrderDto || !createOrderDto.user_id || !createOrderDto.items || !createOrderDto.totalAmount || !createOrderDto.methodType) {
            throw new BadRequestException('Lỗi tạo đơn hàng: Thông tin đơn hàng không hợp lệ!');
        }

        const { user_id, items, totalAmount, methodType, details } = createOrderDto;

        // Kiểm tra nếu items không hợp lệ
        if (!Array.isArray(items) || items.length === 0) {
            throw new BadRequestException('Lỗi tạo đơn hàng: Danh sách sản phẩm không hợp lệ!');
        }


        // Lấy thời gian hiện tại nếu không có thời gian tạo
        const createdAt = dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
        const updatedAt = createdAt;

        // Tạo thông tin đơn hàng
        const order = {
            user_id,
            totalAmount,
            status: createOrderDto.status || 'PENDING', // Đặt trạng thái mặc định là 'PENDING'
            createdAt,
            updatedAt,
            items,
            methodType,
            details,
        };

        // Tạo Redis key sử dụng user_id và thời gian tạo để đảm bảo tính duy nhất
        const orderId = `order:${user_id}:${randomUUID()}`;

        // Lưu thông tin đơn hàng vào Redis với TTL là 30 ngày
        try {
            await this.redisService.set(orderId, JSON.stringify(order), 2592000);  // 2592000 giây = 30 ngày
        } catch (error) {
            throw new InternalServerErrorException('Lỗi khi lưu đơn hàng vào Redis');
        }
        // Gửi sự kiện Kafka về việc tạo đơn hàng (bao gồm phương thức thanh toán)
        try {
            await this.kafkaClient.emit('order.created', {
                orderId,
                user_id,
                totalAmount,
                items,  // Gửi nguyên trạng các item cho sự kiện
                methodType,  // Thêm phương thức thanh toán
                details,  // Thêm chi tiết phương thức thanh toán
            });
        } catch (error) {
            throw new InternalServerErrorException('Lỗi khi gửi sự kiện Kafka');
        }

        // Trả về đơn hàng đã được tạo
        return order;
    }

    async updateOrder(updateOrderDto: UpdateOrderDto) {
        console.log(updateOrderDto.orderId)
        const orderId = updateOrderDto.orderId
        const existingOrder = await this.redisService.get(orderId);

        if (!existingOrder) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }

        let order;
        try {
            order = JSON.parse(existingOrder);
        } catch (error) {
            throw new InternalServerErrorException('Lỗi khi xử lý dữ liệu đơn hàng từ Redis');
        }

        // Kiểm tra tính hợp lệ của updateOrderDto
        if (!updateOrderDto || Object.keys(updateOrderDto).length === 0) {
            throw new BadRequestException('Lỗi cập nhật đơn hàng: Dữ liệu cập nhật không hợp lệ!');
        }

        // Cập nhật thông tin đơn hàng
        const updatedOrder = {
            ...order, // Giữ lại các thông tin cũ
            ...updateOrderDto, // Cập nhật thông tin mới từ DTO
            updatedAt: dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'), // Cập nhật thời gian sửa
        };

        // Lưu thông tin đơn hàng đã cập nhật vào Redis với TTL là 30 ngày
        try {
            await this.redisService.set(orderId, JSON.stringify(updatedOrder), 2592000); // 2592000 giây = 30 ngày
        } catch (error) {
            throw new InternalServerErrorException('Lỗi khi lưu đơn hàng đã cập nhật vào Redis');
        }

        // Gửi sự kiện Kafka về việc cập nhật đơn hàng
        try {
            await this.kafkaClient.emit('order.updated', {
                orderId,
                ...updatedOrder, // Gửi các thông tin cập nhật cho sự kiện
            });
        } catch (error) {
            throw new InternalServerErrorException('Lỗi khi gửi sự kiện Kafka');
        }

        return updatedOrder;
    }

    async getOrderByUserId(user_id: string) {
        const keys = await this.redisService.scanKeys(`order:${user_id}`)

        if (keys.length === 0) {
            return [];
        }

        const values = await this.redisService.getValuesByKeys(keys);

        const ordersWithIds = keys.map((key, index) => {
            const orderData = JSON.parse(values[index])
            return {
                orderId: key,        // Gán orderId từ key
                ...orderData,         // Gán dữ liệu từ value (đã được parse nếu cần)
            };
        });
        return ordersWithIds
    }
}
