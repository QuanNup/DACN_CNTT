import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Index, JoinColumn } from 'typeorm';
import { Payment } from './payment.entities';

@Entity('transactions') // Đặt tên bảng cụ thể
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: false })
    paymentId: string;

    @ManyToOne(() => Payment, (payment) => payment.transactions)
    @JoinColumn({ name: 'paymentId' })
    payment: Payment;

    @Column({ type: 'json', nullable: true })
    details: Record<string, any>; // Thông tin chi tiết giao dịch

    @Column({
        type: 'enum',
        enum: ['SUCCESS', 'ERROR', 'PENDING'],
        default: 'PENDING',
    })
    status: 'SUCCESS' | 'ERROR' | 'PENDING'; // Thêm trạng thái `PENDING`

    @Column({ nullable: true })
    externalTransactionId: string; // ID giao dịch từ cổng thanh toán

    @Column({ nullable: true })
    errorMessage: string; // Lý do lỗi nếu status là 'ERROR'

    @CreateDateColumn()
    createdAt: Date; // Ngày tạo
}
