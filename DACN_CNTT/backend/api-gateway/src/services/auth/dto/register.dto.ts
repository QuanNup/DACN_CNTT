import { IsEmail, IsNotEmpty, IsOptional } from "class-validator"


export class registerDto {
    @IsNotEmpty({ message: "Email không được để trống !" })
    @IsEmail()
    email: string

    @IsNotEmpty({ message: "Password không được để trống !" })
    password: string

    @IsOptional()
    name: string
}