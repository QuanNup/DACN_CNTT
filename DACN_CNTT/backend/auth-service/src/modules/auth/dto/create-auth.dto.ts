import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator"
import { AccountType } from "src/modules/management/users/entities/user.entities";

export class CreateAuthDto {

    @IsNotEmpty({ message: "Email không được để trống !" })
    @IsEmail()
    email: string

    @IsNotEmpty({ message: "Password không được để trống !" })
    password: string

    @IsOptional()
    name: string

    @IsOptional()
    role: number[];

    @IsOptional()
    isActive: boolean;

    @IsEnum(AccountType, {
        message: 'AccountType must be one of: google, facebook, local',
    })
    @IsNotEmpty({ message: 'AccountType is required' })
    accountType: AccountType;
}
