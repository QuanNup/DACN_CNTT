import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseIntPipe, Put, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-request.dto';
import { UpdateUserDto } from './dto/update-user-request.dto';
import { updateUserRoleRequest } from './dto/update-user-role-request.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
  ) {
    return this.usersService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.findDtoById(id);
  }

  // @Put()
  // update(@Body(ValidationPipe) request: UpdateUserDto) {
  //   return this.usersService.updateById(request.id, request);
  // }

  @Put('update-role')
  async updateRoleEmployee(@Body(ValidationPipe) request: updateUserRoleRequest) {
    return this.usersService.updateRoleEmployee(request);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.deleteById(id);
  }
}
