import { Module } from '@nestjs/common';
import { ProductController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './typeorm/entities/product.entities';
import { ProductService } from './products.service';
import { Discount } from './typeorm/entities/discount.entities';
import { ProductImage } from './typeorm/entities/product-image.entities';
import { MulterModule } from '@nestjs/platform-express';
import { Category } from 'src/categories/typeorm/entities/category.entities';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ProductRating } from './typeorm/entities/product_rating.entities';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from 'src/products/kafka-producer.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, Discount, ProductImage, Category, ProductRating]),
        ClientsModule.register([
            {
                name: 'PRODUCT_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: ['kafka:9092'],
                    },
                },
            },
        ]),

    ],
    controllers: [ProductController],
    providers: [ProductService, KafkaProducerService],
    exports: [KafkaProducerService],
})
export class ProductModule { };