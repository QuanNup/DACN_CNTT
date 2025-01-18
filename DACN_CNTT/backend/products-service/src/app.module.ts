import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Product } from './products/typeorm/entities/product.entities';
import { Category } from './categories/typeorm/entities/category.entities';
import { CategoryModule } from './categories/category.module';
import { ProductModule } from './products/products.module';
import { ProductImage } from './products/typeorm/entities/product-image.entities';
import { Discount } from './products/typeorm/entities/discount.entities';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductRating } from './products/typeorm/entities/product_rating.entities';
@Module({
  imports: [
    CategoryModule,
    ProductModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Product, Category, Discount, ProductImage, ProductRating],
      synchronize: true,
      extra: {
        trustServerCertificate: true,
      }
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'), // Trỏ tới thư mục lưu file
      serveRoot: '/uploads', // Đường dẫn truy cập file
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
