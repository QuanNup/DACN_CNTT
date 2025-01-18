import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEmployeeEntity } from './entities/store-employee.entities';
import { StoreEmployeeService } from './store-employee.service';



@Module({
    imports: [
        TypeOrmModule.forFeature([StoreEmployeeEntity])
    ],
    controllers: [],
    providers: [StoreEmployeeService],
    exports: [StoreEmployeeService]
})
export class StoreEmployeeModule { };