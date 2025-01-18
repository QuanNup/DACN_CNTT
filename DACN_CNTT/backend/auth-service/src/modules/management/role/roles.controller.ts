import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Post, Put, Req, ValidationPipe } from '@nestjs/common';
import { CreateRoleRequest } from './dto/create-role-request';
import { RolesService } from './roles.service';


@Controller('roles')
export class RolesController {
    constructor(
        private readonly roleService: RolesService
    ) { }

    @Get("/get-roles")
    async findAllRoles() {
        return this.roleService.findAll();
    }

    @Get("/name/:name")
    async findOneByName(@Param("name") name: string) {
        return this.roleService.findOneDtoByName(name);
    }

    @Get("/id/:id")
    async findOneById(@Param("id", ParseUUIDPipe) id: string) { // Dùng ParseUUIDPipe thay vì ParseIntPipe
        return this.roleService.findOneDtoById(id);
    }

    @Post('/create')
    async createRole(@Body(ValidationPipe) request: CreateRoleRequest, @Req() httpRequest) {
        const requestId = httpRequest.headers['x-request-id'];
        return this.roleService.save(request, requestId);
    }

    @Delete('/delete/:id')
    async deleteOneById(@Param("id", ParseUUIDPipe) id: string) { // Dùng ParseUUIDPipe thay vì ParseIntPipe
        const deleteResult = await this.roleService.deleteOneById(id);
        if (deleteResult.affected === 0) {
            throw new HttpException('Role not found or already deleted', HttpStatus.NOT_FOUND);
        }
        return {
            statusCode: HttpStatus.OK,
            message: 'Role deleted successfully'
        };
    }
}
