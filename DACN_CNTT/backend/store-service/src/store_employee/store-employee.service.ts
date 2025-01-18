import { BadGatewayException, BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as dayjs from "dayjs";
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { StoreEmployeeEntity } from "./entities/store-employee.entities";

dayjs.extend(utc)
dayjs.extend(timezone)

@Injectable()
export class StoreEmployeeService {
    constructor(
        @InjectRepository(StoreEmployeeEntity)
        private readonly storeEmployeeRepository: Repository<StoreEmployeeEntity>
    ) { }

    async create(store_id, user_id: string) {
        const employeeCount = await this.storeEmployeeRepository.count()
        const roleName = employeeCount === 0 ? 'MANAGER' : 'STAFF';
        const employee = await this.storeEmployeeRepository.create({
            employee_id: user_id,
            store: store_id,
            role: roleName,
            createdAt: dayjs().tz('Asia/Ho_Chi_Minh').add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss')
        })
        return await this.storeEmployeeRepository.save(employee)
    }

    async getEmployee(user_id: string) {
        const res = await this.storeEmployeeRepository.findOne({
            where: { employee_id: user_id }
        })
        return res
    }
}