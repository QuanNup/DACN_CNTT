import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CreateOrderItemDto, UpdateOrderItemDto } from "./order-item.dto";
import { Type } from "class-transformer";

export class CardDetailsDto {
    @IsString()
    cardNumber: string; // Số thẻ

    @IsString()
    expiryDate: string; // Ngày hết hạn (theo định dạng MM/YY hoặc YYYY-MM-DD)

    @IsString()
    cardHolder: string; // Tên chủ thẻ

    @IsOptional()
    @IsString()
    securityCode?: string; // Mã bảo mật (CVV) nếu cần, có thể là tùy chọn
}

export class CreateOrderDto {
    @IsNotEmpty()
    @IsUUID()
    user_id: string;

    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    totalAmount: number;

    @IsOptional()  // Chúng ta có thể cho phép tạo đơn hàng mà không cần trạng thái
    @IsEnum(['PENDING', 'PAID', 'CANCELLED'])
    status?: 'PENDING' | 'PAID' | 'CANCELLED' = 'PENDING';  // Đặt trạng thái mặc định là 'PENDING'

    @IsOptional()
    @IsString()
    methodType?: string;

    @ValidateNested()
    @Type(() => CardDetailsDto)
    details?: CardDetailsDto;

    constructor() {
        if (!this.status) this.status = 'PENDING';
        if (!this.methodType) this.methodType = 'credit_card';
    }
}

export class UpdateOrderDto {

    @IsString()
    @IsNotEmpty()
    orderId: string;

    @IsOptional()
    @IsUUID()
    user_id?: string;

    @ValidateNested({ each: true })
    @Type(() => UpdateOrderItemDto)
    @IsOptional()
    items?: UpdateOrderItemDto[];

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    totalAmount?: number;

    @IsOptional()
    @IsEnum(['PENDING', 'PAID', 'CANCELLED'])
    status?: 'PENDING' | 'PAID' | 'CANCELLED';

    @IsOptional()
    @IsString()
    methodType?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => CardDetailsDto) // Đảm bảo sử dụng CardDetailsDto cho thông tin thẻ
    details?: CardDetailsDto;

    constructor() {
        if (!this.status) this.status = 'PENDING';
        if (!this.methodType) this.methodType = 'credit_card';
    }
}
