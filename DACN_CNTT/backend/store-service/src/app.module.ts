import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from './store/entities/store.entities';
import { StoreModule } from './store/store.module';
import { Rating } from './rating/typeorm/entities/rating-store.entities';
import { StoreEmployeeEntity } from './store_employee/entities/store-employee.entities';
import { StoreRolesEntity } from './store_role/entities/store-roles.entities';
import { StoreEmployeeModule } from './store_employee/store-employee.module';


@Module({
  imports: [
    StoreModule,
    StoreEmployeeModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [StoreEntity, Rating, StoreEmployeeEntity, StoreRolesEntity],
      synchronize: true,
      extra: {
        trustServerCertificate: true,
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
