import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';


export class CreateOrderItemDto {

    @IsString()
    @IsNotEmpty()
    cartItemId: string

    @IsNotEmpty()
    @IsUUID()
    productId: string;

    @IsNotEmpty()
    @IsString()
    productName: string;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    price: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    variant: string
}

export class UpdateOrderItemDto {

    @IsString()
    @IsOptional()
    cartItemId?: string

    @IsOptional()
    @IsUUID()
    productId?: string;

    @IsOptional()
    @IsString()
    productName?: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    price?: number;

    @IsOptional()
    @IsNumber()
    quantity?: number;

    @IsString()
    @IsOptional()
    variant: string
}