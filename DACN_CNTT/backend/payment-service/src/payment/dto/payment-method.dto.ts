import { IsArray, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { MethodType } from "../typeorm/entities/payment-method.entities";
import { Type } from "class-transformer";
import { CreatePaymentDto, UpdatePaymentDto } from "./payment.dto";

export class CreatePaymentMethodDto {
    @IsNotEmpty()
    @IsEnum(MethodType) // Kiểm tra tính hợp lệ của enum
    methodType: MethodType; // Loại phương thức thanh toán

    @IsNotEmpty()
    @IsObject()
    details: Record<string, any> // Thông tin chi tiết nếu có

    @ValidateNested({ each: true })
    @Type(() => CreatePaymentDto)
    payments?: CreatePaymentDto[]; // Danh sách các Payment liên kết
}

export class UpdatePaymentMethodDto {
    @IsOptional()
    @IsEnum(MethodType) // Kiểm tra tính hợp lệ của enum
    methodType?: MethodType; // Loại phương thức thanh toán có thể cập nhật

    @IsOptional()
    @IsObject()
    details: Record<string, any> // Thông tin chi tiết có thể cập nhật

    @ValidateNested({ each: true })
    @Type(() => UpdatePaymentDto)
    @IsOptional()
    payments: UpdatePaymentDto[]
}