import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsUUID()
    paymentId: string; // Liên kết với payment

    @IsNotEmpty()
    @IsObject()
    details: Record<string, any>; // Chi tiết giao dịch, cần là một đối tượng

    @IsNotEmpty()
    @IsEnum(['SUCCESS', 'ERROR', 'PENDING'])
    status: 'SUCCESS' | 'ERROR' | 'PENDING';

    @IsOptional()
    @IsString()
    externalTransactionId?: string; // ID giao dịch từ cổng thanh toán

    @IsOptional()
    @IsString()
    errorMessage?: string;
}

export class UpdateTransactionDto {
    @IsOptional()
    @IsObject()
    details: Record<string, any>; // Chi tiết giao dịch

    @IsOptional()
    @IsEnum(['SUCCESS', 'ERROR', 'PENDING'])
    status?: 'SUCCESS' | 'ERROR' | 'PENDING';

    @IsOptional()
    @IsString()
    externalTransactionId?: string; // ID giao dịch từ cổng thanh toán bên ngoài

    @IsOptional()
    @IsString()
    errorMessage?: string;
}