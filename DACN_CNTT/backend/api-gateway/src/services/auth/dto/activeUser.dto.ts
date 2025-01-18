import { IsNotEmpty } from "class-validator"

export class activeUserDto {

    @IsNotEmpty({ message: "Id không được để trống !" })
    id: string

    @IsNotEmpty({ message: "Code không được để trống !" })
    code: string
}