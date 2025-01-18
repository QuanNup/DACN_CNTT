import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class UpdateAuthDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsOptional()
    image: string;
}
