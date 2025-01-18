import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./typeorm/entities/category.entities";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import aqp from "api-query-params";

dayjs.extend(utc)
dayjs.extend(timezone)
@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) { }

    isCategoryExsit = async (category_name: string) => {
        const category = await this.categoryRepository.findOne({ where: { category_name } })
        return !!category
    }

    async create(createCategoryDto: CreateCategoryDto) {
        const { category_name } = createCategoryDto
        const isCategory = await this.isCategoryExsit(category_name)
        if (isCategory) {
            throw new BadRequestException(`Thể loại mặt hàng ${category_name} đã tồn tại! Vui lòng thêm thể loại mặt hàng khác !`)
        }
        const category = await this.categoryRepository.create({
            ...createCategoryDto,
            createdAt: dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'),
            updatedAt: dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'),
        })
        return await this.categoryRepository.save(category)

    }

    async update(updateCategoryDto: Partial<UpdateCategoryDto>) {
        const { category_id, ...updateData } = updateCategoryDto;
        const { category_name } = updateCategoryDto
        const category = await this.categoryRepository.findOne({ where: { category_id } })
        if (!category) {
            throw new BadRequestException('Thể loại mặt hàng không tồn tại!')
        }
        if (category_name && category_name !== category.category_name) {
            const isCategoryExists = await this.categoryRepository.findOne({ where: { category_name } });
            if (isCategoryExists) {
                throw new BadRequestException(`Thể loại mặt hàng ${category_name} đã tồn tại!`);
            }
        }
        Object.assign(category, updateData, {
            updatedAt: dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'), // Cập nhật thời gian chỉnh sửa
        });
        return await this.categoryRepository.save(category);
    }

    async findAll(query: string, current: number, pageSize: number) {
        console.log('next')
        const { filter, sort } = aqp(query)
        if (filter.current) delete filter.current
        if (filter.pageSize) delete filter.pageSize
        current = current > 0 ? current : 1;
        pageSize = pageSize > 0 ? pageSize : 10;
        console.log(current, pageSize)
        const [results, totalItems] = await this.categoryRepository.findAndCount({
            where: filter,
            skip: (current - 1) * pageSize,
            take: pageSize,
            order: sort,
        });

        const totalPages = Math.ceil(totalItems / pageSize);

        return {
            results,
            totalPages,
            current,
            pageSize,
            totalItems,
        };
    }

    async findOne(category_id: string) {
        return await this.categoryRepository.findOne({ where: { category_id } })
    }

    async remove(category_id: string) {
        const category = await this.categoryRepository.findOne({ where: { category_id } });
        if (!category) {
            throw new BadRequestException('Thể loại mặt hàng không tồn tại!');
        }
        return await this.categoryRepository.remove(category);
    }

}