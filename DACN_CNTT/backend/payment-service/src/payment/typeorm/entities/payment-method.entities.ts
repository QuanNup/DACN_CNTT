import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Payment } from './payment.entities';

export enum MethodType {
    CREDIT_CARD = 'credit_card',
    PAYPAL = 'paypal',
    BANK_TRANSFER = 'bank_transfer',
}

@Entity('payment_methods') // Tên bảng cụ thể
export class PaymentMethod {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: MethodType,
        default: MethodType.CREDIT_CARD
    })
    methodType: MethodType; // Enum để đảm bảo giá trị hợp lệ

    @Column({ type: 'json', nullable: true }) // Nếu không phải lúc nào cũng cần
    details: Record<string, any> // Token hoặc thông tin mã hóa

    @OneToMany(() => Payment, (payment) => payment.method)
    payments: Payment[]; // Quan hệ một-nhiều với Payment
}
