import { IsArray, IsOptional, IsObject, IsString } from "class-validator";

class ProductVariant {
    @IsOptional()
    @IsString()
    product_id: string;

    @IsOptional()
    @IsString()
    variant: string;
}

export class BatchProductDetails {
    @IsOptional()
    @IsArray()
    @IsObject({ each: true })
    productVariants: ProductVariant[];
}
