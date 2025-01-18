import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Rating } from './typeorm/entities/rating-store.entities';
import { RatingController } from './rating.controller';


@Module({
    imports: [
        TypeOrmModule.forFeature([Rating])
    ],
    controllers: [RatingController],
    providers: [],
})
export class StoreModule { };