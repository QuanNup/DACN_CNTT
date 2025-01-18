import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Get('category/:id')
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    @Get('get-all-categories')
    findAll(
        @Query() query: string,
        @Query("current") current: string,
        @Query("pageSize") pageSize: string,
    ) {
        return this.categoryService.findAll(query, +current, +pageSize);
    }

    @Delete(':id')
    deleteCategory(@Param('id') id: string) {
        return this.categoryService.remove(id)
    }


    @Post('create')
    createCategory(@Body() createCategory: CreateCategoryDto) {
        return this.categoryService.create(createCategory)
    }

    @Patch('update')
    updateCategory(@Body() updateCategory: UpdateCategoryDto) {
        return this.categoryService.update(updateCategory)
    }
}