import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { PaymentMethod } from './payment-method.entities';
import { Transaction } from './payment-transaction.entities';

@Entity('payments') // Đặt tên bảng cụ thể
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    userId: string; // Nên thống nhất đặt tên theo camelCase

    @Column({ nullable: false })
    orderId: string;

    @ManyToOne(() => PaymentMethod, (method) => method.payments, { eager: true })
    @JoinColumn({ name: 'methodId' })
    method: PaymentMethod; // Quan hệ với PaymentMethod

    @Column({ type: 'uuid', nullable: false })
    methodId: string; // Quan hệ với PaymentMethod

    @Column({ type: 'decimal', precision: 1000, scale: 2 })
    amount: number; // Sử dụng kiểu số thực để xử lý tiền tệ

    @Column({ length: 3 }) // ISO 4217 cho mã tiền tệ (ví dụ: USD, VND)
    currency: string;

    @Column({
        type: 'enum',
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING',
    })
    status: 'PENDING' | 'COMPLETED' | 'FAILED';

    @Column({ nullable: true })
    errorMessage: string; // Lưu thông báo lỗi nếu thanh toán thất bại

    @OneToMany(() => Transaction, (transaction) => transaction.payment)
    transactions: Transaction[]; // Danh sách các giao dịch liên quan

    @CreateDateColumn()
    createdAt: Date; // Ngày tạo
}
