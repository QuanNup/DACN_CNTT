import { isNumber, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateShoppingCartIteamDto {
    @IsString()
    @IsOptional()
    product_id: string;

    @IsOptional()
    @IsNumber()
    quantity?: number;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsString()
    variant?: string;
}
