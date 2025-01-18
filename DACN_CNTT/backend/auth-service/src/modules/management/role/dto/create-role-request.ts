import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRoleRequest{
    @IsString()
    @IsNotEmpty()
    name:string
}