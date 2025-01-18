import { IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {

    @IsNotEmpty()
    @IsString()
    category_name: string;

    @IsOptional()
    @IsString()
    category_description: string;

}
