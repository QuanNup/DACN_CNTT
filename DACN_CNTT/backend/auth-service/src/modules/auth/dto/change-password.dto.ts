import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class ChangePasswordAuthDto {

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    old_password: string;

    @IsString()
    @IsNotEmpty()
    new_password: string;
}
