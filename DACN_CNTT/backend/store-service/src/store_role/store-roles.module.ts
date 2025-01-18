import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreRolesEntity } from './entities/store-roles.entities';


@Module({
    imports: [
        TypeOrmModule.forFeature([StoreRolesEntity])
    ],
    controllers: [],
    providers: [],
})
export class StoreRolesModule { };