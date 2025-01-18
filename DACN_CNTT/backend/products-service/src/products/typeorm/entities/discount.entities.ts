import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./product.entities";

@Entity({ name: 'discount' })
export class Discount {
    @PrimaryGeneratedColumn('uuid')
    discount_id: string;

    @ManyToOne(() => Product, (product) => product.discounts, { nullable: false })
    product: Product;

    @Column({ type: 'decimal', nullable: true })
    percentage: number; // Tỷ lệ giảm giá (ví dụ: 10%)

    @Column({ type: 'decimal', nullable: true })
    fixed_amount: number; // Giảm giá cố định (ví dụ: 50,000 VND)

    @Column({ nullable: false })
    start_date: Date;

    @Column({ nullable: false })
    end_date: Date;
}
