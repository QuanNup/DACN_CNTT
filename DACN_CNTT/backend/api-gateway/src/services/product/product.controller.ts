import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, HttpException, Param, ParseIntPipe, Post, Put, Query, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { lastValueFrom } from 'rxjs';
import * as FormData from 'form-data'
import { Response } from 'express';
import { BatchProductDetails } from './dto/batch-product-detail.dto';
@Controller('products')
export class ProductController {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }

    @Get('get-all-products')
    async getAll(
        @Query() query: any,
        @Query("current") current: string,
        @Query("pageSize") pageSize: string,
    ) {
        try {
            const currentPage = current ? +current : 1;
            const size = pageSize ? +pageSize : 10;

            // Tạo query params từ các tham số
            const queryParams = {
                ...query,
                current: currentPage,
                pageSize: size,
            };
            const response = await lastValueFrom(
                this.httpService.get(`${this.configService.get<string>('URI_PRODUCT_SERVICE')}/products/get-all-products`, { params: queryParams })
            );
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Get('get-hot-products')
    async getHotProdcut() {
        try {
            const response = await lastValueFrom(
                this.httpService.get(`${this.configService.get<string>('URI_PRODUCT_SERVICE')}/products/get-hot-products`)
            );
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Get('product-detail/:id')
    async getProductById(@Param('id') id: string) {
        try {
            const response = await lastValueFrom(
                this.httpService.get(`${this.configService.get<string>('URI_PRODUCT_SERVICE')}/products/product-detail/${id}`)
            );
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Post('create-product')
    @UseInterceptors(FilesInterceptor('images'))
    async createProduct(
        @Body() createProductDto: any, // DTO của bạn
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        try {
            // Tạo form-data để gửi tới product-service
            const formData = new FormData();
            //Append các trường trong DTO
            for (const key in createProductDto) {
                if (Array.isArray(createProductDto[key])) {
                    createProductDto[key].forEach((value) => formData.append(key, value));
                } else {
                    formData.append(key, createProductDto[key]);
                }
            }

            // // Append file upload vào form-data
            if (files && files.length > 0) {
                files.forEach((file) => {
                    formData.append('images', file.buffer, {
                        filename: file.originalname,
                        contentType: file.mimetype,
                    });
                });
            }
            const response = await lastValueFrom(
                this.httpService.post(`${this.configService.get<string>('URI_PRODUCT_SERVICE')}/products/create-product`,
                    formData,
                    {
                        headers: formData.getHeaders(),
                    }
                )
            );
            // // Trả về kết quả cho client
            return response.data;
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Put('update-product/:product_id')
    @UseInterceptors(FilesInterceptor('images'))
    async updateProduct(
        @Param('product_id') product_id: string,
        @Body() createProductDto: any,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        try {
            // Tạo form-data để gửi tới product-service
            const formData = new FormData();
            //Append các trường trong DTO
            for (const key in createProductDto) {
                if (Array.isArray(createProductDto[key])) {
                    createProductDto[key].forEach((value) => formData.append(key, value));
                } else {
                    formData.append(key, createProductDto[key]);
                }
            }

            // // Append file upload vào form-data
            if (files && files.length > 0) {
                files.forEach((file) => {
                    formData.append('images', file.buffer, {
                        filename: file.originalname,
                        contentType: file.mimetype,
                    });
                });
            }
            const response = await lastValueFrom(
                this.httpService.put(`${this.configService.get<string>('URI_PRODUCT_SERVICE')}/products/update-product/${product_id}`,
                    formData,
                    {
                        headers: formData.getHeaders(),
                    }
                )
            );
            // // Trả về kết quả cho client
            return response.data;
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }


    @Get('uploads/:product/:productImage')
    async getImages(
        @Param('product') product: string,
        @Param('productImage') productImage: string,
        @Res() res: Response,
    ) {
        try {
            const imageUrl = `${this.configService.get<string>('URI_PRODUCT_SERVICE')}/uploads/${product}/${productImage}`;
            const response = await lastValueFrom(
                this.httpService.get(imageUrl, { responseType: 'stream' },)
            );
            Object.entries(response.headers).forEach(([key, value]) => {
                res.setHeader(key, value); // Sử dụng setHeader thay vì set
            });
            response.data.pipe(res);
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Post('batch-details')
    async getBatchProductDetails(@Body() batchProductDetails: BatchProductDetails) {
        try {
            const response = await lastValueFrom(
                this.httpService.post(`${this.configService.get<string>('URI_PRODUCT_SERVICE')}/products/batch-details`,
                    batchProductDetails,
                ),
            );
            return response.data
        } catch (error) {
            throw new HttpException(
                error.response?.data?.message || 'Internal Server Error',
                error.response?.status || 500,
            );
        }
    }

    @Get('get-all-categories')
    async getCategories(
        @Query() query: any,
        @Query("current") current: string,
        @Query("pageSize") pageSize: string,) {
        try {
            console.log(`${this.configService.get<string>('URI_PRODUCT_SERVICE')}/categories/get-all-categories`)
            const currentPage = current ? +current : 1;
            const size = pageSize ? +pageSize : 10;
            const queryParams = {
                ...query,
                current: currentPage,
                pageSize: size,
            };
            const response = await lastValueFrom(
                this.httpService.get(`${this.configService.get<string>('URI_PRODUCT_SERVICE')}/categories/get-all-categories`, { params: queryParams }),
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