import { Body, Controller, Get, Inject, OnModuleInit, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom, timeout } from 'rxjs';

@Controller('search')
export class SearchController implements OnModuleInit {
    constructor(
        private readonly searchService: SearchService,
        @Inject('PRODUCT_SERVICE') private readonly productClient: ClientKafka,
        @Inject('STORE_SERVICE') private readonly storeClient: ClientKafka,

    ) { }

    async onModuleInit() {
        // Đăng ký topic phản hồi
        this.productClient.subscribeToResponseOf('product-search');
        this.productClient.subscribeToResponseOf('category-search');
        this.storeClient.subscribeToResponseOf('store-search');

        this.productClient.subscribeToResponseOf('product-suggestion');
        this.productClient.subscribeToResponseOf('category-suggestion');
        this.storeClient.subscribeToResponseOf('store-suggestion');

        // Kết nối với Kafka
        await this.productClient.connect();
        await this.storeClient.connect();
        console.log('Connected to Kafka and subscribed to topics');
    }

    //@Get()
    //@Query('q') query: string
    @MessagePattern('search-request')
    async handleSearchRequest(@Payload() data: any) {
        try {
            const { query } = data;
            console.log('Sending search request to Product-Service...', query)

            // Gửi yêu cầu tới product-service và store-service
            const productResults = await lastValueFrom(
                this.productClient.send('product-search', { query }),
            );
            console.log(productResults)
            const storeResults = await lastValueFrom(
                this.storeClient.send('store-search', { query }),
            );
            console.log(storeResults)
            const categoryResults = await lastValueFrom(
                this.productClient.send('category-search', { query }),
            );
            console.log(categoryResults)
            // Trả kết quả hợp nhất
            return {
                products: productResults,
                stores: storeResults,
                categories: categoryResults,
            };
        } catch (error) {
            console.error('Error occurred while searching products:', {
                message: error.message,
                stack: error.stack,
            });
            throw new Error('Failed to fetch products. Please try again later.');
        }
    }
    @MessagePattern('search-suggestion')
    async handleSearchSuggestion(@Payload() data: any) {
        const { query } = data;

        // Gửi yêu cầu tới các service
        const productSuggestions = await lastValueFrom(
            this.productClient.send('product-suggestion', { query }),
        );
        const storeSuggestions = await lastValueFrom(
            this.storeClient.send('store-suggestion', { query }),
        );
        const categorySuggestions = await lastValueFrom(
            this.productClient.send('category-suggestion', { query }),
        );

        // Kết hợp kết quả
        return {
            products: productSuggestions,
            stores: storeSuggestions,
            categories: categorySuggestions,
        };
    }
} 