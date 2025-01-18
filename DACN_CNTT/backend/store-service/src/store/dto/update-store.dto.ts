import { IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateStoreDto {

    @IsNotEmpty()
    @IsOptional()
    store_id: string

    @IsOptional()
    @IsString()
    store_name: string;

    @IsOptional()
    @IsString()
    store_description: string;

    @IsOptional()
    @IsNotEmpty()
    @IsUUID()
    owner_id: string
}
