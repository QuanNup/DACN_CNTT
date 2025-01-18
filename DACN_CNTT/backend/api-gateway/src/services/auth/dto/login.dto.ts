import { IsEmail, IsNotEmpty } from "class-validator"

export class loginDto {
    @IsNotEmpty({ message: "Email không được để trống !" })
    @IsEmail()
    email: string

    @IsNotEmpty({ message: "Password không được để trống !" })
    password: string
}