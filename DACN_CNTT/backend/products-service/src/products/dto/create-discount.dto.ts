import { IsDecimal, IsDate, IsOptional, Min } from 'class-validator';

export class CreateDiscountDto {
    @IsOptional()
    @IsDecimal()
    @Min(0)
    percentage?: number; // Tỷ lệ giảm giá (ví dụ: 10%)

    @IsOptional()
    @IsDecimal()
    @Min(0)
    fixed_amount?: number; // Giá trị giảm giá cố định (ví dụ: 50,000 VND)

    @IsDate()
    start_date: Date; // Ngày bắt đầu giảm giá

    @IsDate()
    end_date: Date; // Ngày kết thúc giảm giá
}
