import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'PRODUCT_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'search-service',
                        brokers: ['kafka:9092'],
                    },
                    consumer: {
                        groupId: 'search-service-product-group', // Đặt groupId duy nhất
                    },
                },
            },
            {
                name: 'STORE_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'search-service',
                        brokers: ['kafka:9092'],
                    },
                    consumer: {
                        groupId: 'search-service-store-group', // Đặt groupId duy nhất
                    },
                },
            },
        ]),
    ],
    controllers: [SearchController],
    exports: [SearchService],
    providers: [SearchService],
})
export class SearchModule { };