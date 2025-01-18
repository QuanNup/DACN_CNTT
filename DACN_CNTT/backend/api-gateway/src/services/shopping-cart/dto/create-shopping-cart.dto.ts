import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateShoppingCartIteamDto } from "./create-shopping-cart-iteam.dto";
import { Type } from "class-transformer";

export class CreateShoppingCartDto {

    @IsOptional()
    @IsString()
    user_id: string

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateShoppingCartIteamDto)
    items?: CreateShoppingCartIteamDto[]

    @IsOptional()
    @IsNumber()
    totalPrice: number;
}