import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductController } from './product.controller';


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
    controllers: [ProductController],
    providers: [],
})
export class ProductModule { }
