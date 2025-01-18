import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from './entities/store.entities';
import { StoreService } from './store.service';
import { StoreEmployeeService } from 'src/store_employee/store-employee.service';
import { StoreEmployeeModule } from 'src/store_employee/store-employee.module';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
    imports: [
        TypeOrmModule.forFeature([StoreEntity]),
        StoreEmployeeModule,
        // ClientsModule.register([
        //     {
        //         name: 'STORE_SERVICE',
        //         transport: Transport.KAFKA,
        //         options: {
        //             client: {
        //                 brokers: ['kafka:9092'],
        //             },
        //         },
        //     },
        // ]),
    ],
    controllers: [StoreController],
    providers: [StoreService],
})
export class StoreModule { };