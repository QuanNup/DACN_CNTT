import { BadGatewayException, BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateStoreDto } from "./dto/create-store.dto";
import * as dayjs from "dayjs";
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { UpdateStoreDto } from "./dto/update-store.dto";
import { StoreEntity } from "./entities/store.entities";
import { StoreEmployeeService } from "src/store_employee/store-employee.service";
import { BatchStoreDetails } from "./dto/get-batch.dto";
import { StoreEmployeeEntity } from "src/store_employee/entities/store-employee.entities";

dayjs.extend(utc)
dayjs.extend(timezone)

@Injectable()
export class StoreService {
    constructor(
        @InjectRepository(StoreEntity)
        private readonly storeRepository: Repository<StoreEntity>,
        private readonly storeEmployeeService: StoreEmployeeService
    ) { }

    // checkStoreExists = async (store_id: string)=> {
    //     try {
    //         const response = await this.httpService.get(`http://store-service/stores/${store_id}`).toPromise();
    //     } catch (error) {
    //         throw new BadRequestException('Cửa hàng không tồn tại');
    //     }
    // }
    async getStoreEmployee(user_id: string) {
        const res = await this.storeEmployeeService.getEmployee(user_id)
        return res
    }

    isOwnerExist = async (owner_id: string) => {
        const Owner = await this.storeRepository.findOne({ where: { owner_id } })
        return !!Owner
    }
    isStoreExist = async (store_name: string) => {
        const store = await this.storeRepository.findOne({ where: { store_name } })
        return !!store
    }

    async create(createStoreDto: CreateStoreDto) {
        const { store_name, owner_id } = createStoreDto
        const isStore = await this.isStoreExist(store_name)
        const isOwner = await this.isOwnerExist(owner_id)
        if (isOwner) {
            throw new BadRequestException('Mỗi tài chỉ được tạo một cửa hàng duy nhất!')
        }
        if (isStore) {
            throw new BadRequestException(`Cửa hàng ${store_name} đã tồn tại trên hệ thống! Vui lòng chọn tên cửa hàng khác!`)
        }

        const store = await this.storeRepository.create({
            ...createStoreDto,
            createdAt: dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'),
            updatedAt: dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'),
        })

        return await this.storeRepository.save(store)
    }

    async update(updateStoreDto: Partial<UpdateStoreDto>) {
        const { store_id, owner_id, ...updateData } = updateStoreDto;
        const { store_name } = updateStoreDto
        const store = await this.storeRepository.findOne({ where: { store_id } })
        if (!store) {
            throw new BadRequestException('Cửa hàng không tồn tại!')
        }
        if (store_name && store_name !== store.store_name) {
            const isCategoryExists = await this.storeRepository.findOne({ where: { store_name } });
            if (isCategoryExists) {
                throw new BadRequestException(`Cửa hàng ${store_name} đã tồn tại trên hệ thống! Vui lòng chọn tên cửa hàng khác!`);
            }
        }
        Object.assign(store, updateData, {
            updatedAt: dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'), // Cập nhật thời gian chỉnh sửa
        });
        return await this.storeRepository.save(store);
    }

    async findOne(store_id: string) {
        return await this.storeRepository.findOne({ where: { store_id } })
    }

    async findAllStorePending() {
        return await this.storeRepository.findOne({ where: { status: 'PENDING' } })
    }

    async approvedStore(store_id: string) {
        const store = await this.storeRepository.findOne({ where: { store_id } })
        if (!store) {
            throw new BadRequestException(`Cửa hàng không tồn tại trên hệ thống !`);
        }
        if (store.status === 'APPROVED') {
            throw new BadRequestException(`Cửa hàng đã được cấp phép trên hệ thống !`)
        }
        store.status = 'APPROVED'
        Object.assign(store, {
            updatedAt: dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'), // Cập nhật thời gian chỉnh sửa
        });
        await this.storeRepository.save(store)

        await this.storeEmployeeService.create(store_id, store.owner_id)
        return {
            message: 'Cập nhật trạng thái cửa hàng thành công !'
        }
    }

    async getBatchStoreDetails(storeId: BatchStoreDetails) {
        if (!storeId) {
            throw new BadRequestException('Cửa hàng không hợp lệ!')
        }
        const storeIds = storeId.stores.map(v => v.store_id);
        const stores = await this.storeRepository.find({
            where: { store_id: In(storeIds) },
            relations: ['ratings']
        })
        return stores
    }
}