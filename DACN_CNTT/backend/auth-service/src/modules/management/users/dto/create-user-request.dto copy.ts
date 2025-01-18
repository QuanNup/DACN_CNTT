import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { AccountType } from "../entities/user.entities";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsString()
    @Matches(/^(0|\+84)\d{9}$/, {
        message: "phone must be valid (example: 0123456781 or +84123456781)"
    })
    phone: string;

    @IsOptional()
    role: string[];

    @IsOptional()
    address: string;

    @IsOptional()
    image: string;

    @IsOptional()
    isActive: boolean;

    @IsEnum(AccountType, {
        message: 'AccountType must be one of: google, facebook, local',
    })
    @IsNotEmpty({ message: 'AccountType is required' })
    accountType: AccountType;
}
