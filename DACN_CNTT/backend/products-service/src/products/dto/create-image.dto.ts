import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { ProductVariantDto } from "./create-variant.dto";

export class ProductImageDto {
    @IsString()
    url: string; // Đường dẫn hình ảnh

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductVariantDto)
    discounts?: ProductVariantDto[]; // Danh sách giảm giá (nếu có)
}