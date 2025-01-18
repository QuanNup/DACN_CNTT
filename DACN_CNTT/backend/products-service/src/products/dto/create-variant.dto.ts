import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";

export class ProductVariantDto {
    @IsString()
    variant: string; // Đường dẫn hình ảnh
}