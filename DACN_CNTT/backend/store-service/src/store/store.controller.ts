import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreService } from './store.service';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from './entities/store.entities';
import { BatchStoreDetails } from './dto/get-batch.dto';
@Controller('store')
export class StoreController {
    constructor(
        private readonly storeService: StoreService,
        @InjectRepository(StoreEntity)
        private readonly storeRepository: Repository<StoreEntity>,

    ) { }

    @Get('get-employee/:user_id')
    async getEmployee(@Param('user_id') user_id: string) {
        const res = await this.storeService.getStoreEmployee(user_id)
        return res
    }

    @Post('create-store')
    createStore(@Body() createStoreDto: CreateStoreDto) {
        return this.storeService.create(createStoreDto)
    }

    @Put('approved-store')
    approvedStore(@Body() body: { store_id: string }) {
        return this.storeService.approvedStore(body.store_id)
    }

    @Post('get-store-by-id')
    async getStoreById(@Body() storeId: BatchStoreDetails) {
        return await this.storeService.getBatchStoreDetails(storeId)
    }

    @Get('store-pending')
    getStorePending() {
        return this.storeService.findAllStorePending()
    }

    @MessagePattern('store-search')
    async handleSearchStores(@Payload() data: any) {
        const { query } = data;

        // Tìm kiếm trong cơ sở dữ liệu
        const results = await this.storeRepository
            .createQueryBuilder('store')
            .where('store.store_name ILIKE :query OR store.store_description ILIKE :query', {
                query: `%${query}%`,
            })
            .getMany();

        return results;
    }

    @MessagePattern('store-suggestion')
    async handleStoreSuggestion(@Payload() data: any) {
        const { query } = data;

        // Tìm kiếm từ khóa trong tên cửa hàng
        const suggestions = await this.storeRepository
            .createQueryBuilder('store')
            .select(['store.store_id', 'store.store_name'])
            .where('store.store_name ILIKE :query', { query: `%${query}%` })
            //.limit(5) // Giới hạn số lượng kết quả
            .getMany();

        return suggestions;
    }

}