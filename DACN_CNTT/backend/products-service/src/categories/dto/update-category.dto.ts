import { IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
    @IsOptional()
    @IsNotEmpty()
    category_id: string

    @IsOptional()
    @IsString()
    category_name: string

    @IsOptional()
    @IsString()
    category_description: string
}
