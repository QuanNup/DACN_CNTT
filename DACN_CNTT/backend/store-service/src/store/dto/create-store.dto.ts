import { IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateStoreDto {

    @IsNotEmpty()
    @IsString()
    store_name: string;

    @IsOptional()
    @IsString()
    store_description: string;

    @IsNotEmpty()
    @IsUUID()
    owner_id: string
}
