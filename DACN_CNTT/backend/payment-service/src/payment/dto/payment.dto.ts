import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { CreateTransactionDto, UpdateTransactionDto } from './payment-transaction.dto';
import { CreatePaymentMethodDto } from './payment-method.dto';

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @IsNotEmpty()
    @IsString()
    orderId: string;

    @IsNotEmpty()
    @IsUUID()  // methodId should be a UUID (or string, based on your setup)
    methodId: string; // ID của phương thức thanh toán

    @ValidateNested({ each: true })
    @Type(() => CreateTransactionDto) // Chuyển đổi mảng đối tượng
    transactions: CreateTransactionDto[];

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    amount: number;

    @IsNotEmpty()
    @IsString()
    currency: string;

    @IsOptional()
    @IsEnum(['PENDING', 'COMPLETED', 'FAILED'])
    status?: 'PENDING' | 'COMPLETED' | 'FAILED';

    @IsOptional()
    @IsString()
    errorMessage?: string;
}

export class UpdatePaymentDto {
    @IsOptional()
    @IsUUID()
    userId?: string;

    @IsOptional()
    @IsString()
    orderId?: string;

    @IsOptional()
    @IsUUID()  // methodId should be a UUID (or string, based on your setup)
    methodId: string; // ID của phương thức thanh toán

    @ValidateNested({ each: true })
    @Type(() => UpdateTransactionDto)
    @IsOptional()
    transactions?: UpdateTransactionDto[];

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    amount?: number;

    @IsOptional()
    @IsString()
    currency?: string;

    @IsOptional()
    @IsEnum(['PENDING', 'COMPLETED', 'FAILED'])
    status?: 'PENDING' | 'COMPLETED' | 'FAILED';

    @IsOptional()
    @IsString()
    errorMessage?: string;
}
