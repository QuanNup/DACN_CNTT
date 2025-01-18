import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, HttpException, Post, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { CreateStoreDto } from './dto/create-store.dto';
import { Roles } from 'src/config/decorator/customize';
import { Role } from 'src/config/enum/role';
import { BatchStoreDetails } from './dto/get-batch.dto';


@Controller('store')
export class StoreController {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }

    @Roles(Role.ADMIN_GLOBAL)
    @Post('create-store')
    async createStore(@Req() req, @Body() createStoreDto: CreateStoreDto) {
        try {
            const userId = req['user'].id
            const storeData = {
                ...createStoreDto,
                owner_id: userId  // Gán owner_id với giá trị của userId
            };
            const response = await lastValueFrom(
                this.httpService.post(`${this.configService.get<string>('URI_STORE_SERVICE')}/create-store`, storeData)
            )
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Post('get-store-by-id')
    async getStoreById(@Body() storeId: BatchStoreDetails) {
        try {
            const response = await lastValueFrom(this.httpService.post(`${this.configService.get<string>('URI_STORE_SERVICE')}/store/get-store-by-id`, storeId)
            )
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Roles(Role.ADMIN_GLOBAL)
    @Get('store-pending')
    async getStorePending() {
        try {
            const response = await lastValueFrom(this.httpService.get(`${this.configService.get<string>('URI_STORE_SERVICE')}/store/store-pending`)
            )
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }
}