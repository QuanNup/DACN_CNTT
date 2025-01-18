import { HttpService } from '@nestjs/axios';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('search')
export class SearchController {
    constructor(
        @Inject('GATEWAY_SEARCH_SERVICE') private readonly clientKafka: ClientKafka,
        private readonly httpService: HttpService
    ) {
        //this.clientKafka.connect();
    }

    async onModuleInit() {
        this.clientKafka.subscribeToResponseOf('search-request');
        this.clientKafka.subscribeToResponseOf('search-suggestion');
        await this.clientKafka.connect();
    }
    @Get()
    async search(@Query('q') query: string) {
        console.log('Send gateway')
        const response = await lastValueFrom(
            this.clientKafka.send('search-request', { query }),
        );

        return response;
    }

    @Get('suggestions')
    async getSuggestions(@Query('q') query: string) {
        const response = await lastValueFrom(
            this.clientKafka.send('search-suggestion', { query }),
        );
        return response; // Kết quả gợi ý từ search-service
    }

    // @Get()
    // async search(@Query('q') query: string) {
    //     console.log('Send gateway', query)
    //     const response = await lastValueFrom(this.httpService
    //         .get(`http://search-service:8085/search`, { params: { q: query } }))
    //     return response.data;
    // }

    // @Get('suggestions')
    // async getSuggestions(@Query('q') query: string) {
    //     const response = await lastValueFrom(this.httpService
    //         .get(`http://search-service:8085/search`, { params: { q: query } }))
    //     return response.data; // Kết quả gợi ý từ search-service
    // }

    // @Get()
    // async search(@Query('q') query: string) {
    //     const searchQuery = {
    //         index: 'products', // Elasticsearch index
    //         query: {
    //             match: { name: query }, // Truy vấn tìm kiếm
    //         },
    //     };
    //     try {
    //         const response = await lastValueFrom(this.clientKafka.send('search-query', searchQuery));
    //         return response;
    //     } catch (error) {
    //         console.error('Search error:', error);
    //         return { error: 'Search service is currently unavailable' }; // Phản hồi thân thiện hơn
    //     }
    // }
    // @Get()
    // async search(@Query('q') query: string) {
    //     const response = await lastValueFrom(this.httpService
    //         .get(`http://search-service:8085/search`, {
    //             params: { q: query },
    //         }))
    //     return response.data;
    // }

    // @Get('/suggestions')
    // async getSuggestions(@Query('q') query: string) {
    //     const searchQuery = {
    //         index: 'products', // Elasticsearch index
    //         query: {
    //             prefix: { name: query }, // Elasticsearch query với prefix
    //         },
    //     };
    //     try {
    //         const response = await lastValueFrom(this.clientKafka.send('search-query', searchQuery));
    //         return response;
    //     } catch (error) {
    //         console.error('Search error:', error);
    //         return { error: 'Search service is currently unavailable' }; // Phản hồi thân thiện hơn
    //     }
    // }
}