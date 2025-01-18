import { IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateProductDto {

    @IsNotEmpty()
    product_id: string

    @IsString()
    @IsOptional()
    product_name: string;

    @IsOptional()
    @IsString()
    product_description: string;

    @IsNumber()
    @IsOptional()
    product_price: number

    @IsNumber()
    @IsOptional()
    stock_quantity: number

    @IsUUID()
    @IsNotEmpty()
    @IsOptional()
    store_id: string

    @IsNotEmpty()
    @IsOptional()
    image_url: string
}