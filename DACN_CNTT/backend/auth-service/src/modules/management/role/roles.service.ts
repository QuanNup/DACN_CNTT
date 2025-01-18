import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entity/roles.entity';
import { Repository } from 'typeorm';
import { RoleDTO } from './dto/role.dto';
import { plainToClass } from 'class-transformer';
import { Role } from './dto/role.dt';
import { updateRolePermissionRequest } from './dto/update-role-request';
import { RedisService } from 'src/state/service/redis.service';


@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(RoleEntity)
        private roleRepository: Repository<RoleEntity>,
        private redisService: RedisService
    ) {

    }
    async save(request: Role, requestId: string): Promise<RoleDTO> {
        const { name } = request
        const role = new RoleEntity()
        role.name = name
        if (await this.findOneByName(role.name) != null) {
            throw new BadRequestException("role existed")
        }
        const response = await this.roleRepository.save(role);
        this.redisService.set(requestId, JSON.stringify(response), 60 * 60 * 24)
        return plainToClass(RoleDTO, response);
    }

    async findAll() {
        return this.roleRepository.find();
    }

    async findOneByName(name: string) {
        return this.roleRepository.findOneBy({ name });
    }

    async findOneById(id: string) {
        return this.roleRepository.findOneBy({ id });
    }

    async findOneDtoByName(name: string) {
        const role = await this.findOneByName(name);
        if (!role) {
            throw new BadRequestException("role not existed");
        }
        return plainToClass(RoleDTO, role);
    }

    async findOneDtoById(id: string) {
        const role = await this.findOneById(id);
        if (!role) {
            throw new BadRequestException("role not existed");
        }
        return plainToClass(RoleDTO, role);
    }

    async deleteOneById(id: string) {
        return this.roleRepository.delete({ id });
    }
}
