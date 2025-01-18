import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';


@Module({
    imports: [
        HttpModule,
        ClientsModule.register([
            {
                name: 'GATEWAY_SEARCH_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'gateway-search-service',
                        brokers: ['kafka:9092'],
                    },
                    consumer: {
                        groupId: 'gateway-search-service-consumer',
                    },
                },
            },
        ]),
    ],
    controllers: [SearchController],
    providers: [],
})
export class SearchModule { };