import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateShoppingCartIteamDto } from "./create-shopping-cart-iteam.dto";
import { Type } from "class-transformer";
import { UpdateShoppingCartIteamDto } from "./update-shopping-cart-iteam.dto";

export class UpdateShoppingCartDto {

    @IsOptional()
    @IsString()
    id: string

    @IsOptional()
    @IsString()
    user_id: string

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateShoppingCartIteamDto)
    items?: UpdateShoppingCartIteamDto[]

    @IsOptional()
    @IsNumber()
    totalPrice: number;
}