import { Max, Min } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entities';
// Giả định bạn có entity User

@Entity('product_ratings')
export class ProductRating {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ nullable: false })
    @Min(0, { message: 'Rating must be at least 0.' })
    @Max(5, { message: 'Rating cannot exceed 5.' })
    rating: number;

    @Column({ nullable: true, length: 500 })
    comment: string;

    @ManyToOne(() => Product, (product) => product.ratings, { onDelete: 'CASCADE' })
    product: Product;

    @Column({ nullable: false })
    user: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
