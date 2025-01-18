import { IsString, IsNumber, IsOptional, IsArray, IsUUID, Min, Max, IsDate, IsDecimal, ValidateNested } from 'class-validator';
import { CreateDiscountDto } from './create-discount.dto';
import { ProductImageDto } from './create-image.dto';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    product_name: string;

    @IsOptional()
    @IsString()
    product_description?: string;

    @IsDecimal()
    @Min(0)
    product_price: number;

    @IsNumber()
    @Min(0)
    stock_quantity: number;

    @IsUUID()
    category_id: string; // ID của Category (một product thuộc một category)

    @IsUUID()
    store_id: string; // ID của Store

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductImageDto)
    images?: ProductImageDto[]; // Danh sách URL của hình ảnh sản phẩm

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateDiscountDto)
    discounts?: CreateDiscountDto[]; // Danh sách giảm giá (nếu có)

    @IsOptional()
    @IsDate()
    created_at?: Date;

    @IsOptional()
    @IsDate()
    updated_at?: Date;

    @IsOptional()
    @IsNumber()
    purchase_count: number;
}
