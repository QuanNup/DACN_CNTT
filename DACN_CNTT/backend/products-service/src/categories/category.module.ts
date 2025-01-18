import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './typeorm/entities/category.entities';
import { CategoryService } from './category.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category])
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
})
export class CategoryModule { };