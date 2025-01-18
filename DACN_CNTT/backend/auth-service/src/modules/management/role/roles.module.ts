import { Global, Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entity/roles.entity';
import { RedisService } from 'src/state/service/redis.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  controllers: [RolesController],
  providers: [RolesService, RedisService],
  exports: [RolesService]
})
export class RolesModule { }
