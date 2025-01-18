import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StoreController } from './store.controller';

@Module({
    imports: [
        HttpModule,
        // ClientsModule.register([
        //     {
        //         name: 'AUTH_SERVICE',
        //         transport: Transport.KAFKA,
        //         options: {
        //             client: {
        //                 clientId: 'auth-service',
        //                 brokers: ['localhost:9092'],
        //             },
        //             consumer: {
        //                 groupId: 'auth-service-consumer',
        //             },
        //         },
        //     },
        // ]),
    ],
    controllers: [StoreController],
    providers: [],
})
export class StoreModule { }
