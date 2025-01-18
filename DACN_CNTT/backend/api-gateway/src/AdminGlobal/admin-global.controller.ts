import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, HttpException, Post, Put } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { Roles } from 'src/config/decorator/customize';
import { Role } from 'src/config/enum/role';

@Roles(Role.ADMIN_GLOBAL)
@Controller('admin-global')
export class AdminGlobalController {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService) { }

    @Get('store-pending')
    async storePending() {
        const response = await lastValueFrom(this.httpService.get(`${this.configService.get<string>('URI_STORE_SERVICE')}/store/store-pending`))
        console.log(response.data)
        return response.data
    }

    @Put('approved-store')
    async approvedStore(@Body() store_id: string) {
        try {
            console.log(store_id)
            const response = await lastValueFrom(this.httpService.put(`${this.configService.get<string>('URI_STORE_SERVICE')}/store/approved-store`, store_id))
            console.log(response.data)
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }

    }

}