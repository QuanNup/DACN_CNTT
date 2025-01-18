import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../role/roles.module';
import { UserEntity } from './entities/user.entities';
import { RedisService } from 'src/state/service/redis.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([UserEntity]), RolesModule
  ],
  controllers: [UsersController],
  providers: [UsersService, RedisService],
  exports: [UsersService],
})
export class UsersModule { }
