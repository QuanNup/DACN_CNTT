import { Category } from "src/categories/typeorm/entities/category.entities";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Discount } from "./discount.entities";
import { ProductImage } from "./product-image.entities";
import { Max, Min } from "class-validator";
import { ProductRating } from "./product_rating.entities";

@Entity({ name: 'product' })
export class Product {
    @PrimaryGeneratedColumn('uuid')
    product_id: string;

    @Column({ nullable: false })
    product_name: string;

    @Column({ nullable: true })
    product_description: string;

    @Column('decimal', { nullable: false })
    product_price: number;

    @Column({ nullable: false })
    stock_quantity: number;

    @ManyToOne(() => Category, (category) => category.products, { nullable: false })
    category: Category;

    @OneToMany(() => ProductImage, (productImage) => productImage.product)
    images: ProductImage[];

    @Column({ nullable: false })
    store_id: string;

    @Column({ nullable: false })
    created_at: Date;

    @Column({ nullable: false })
    updated_at: Date;

    @Column({ type: 'int', default: 0 })
    purchase_count: number;

    @OneToMany(() => Discount, (discount) => discount.product)
    discounts: Discount[];

    @OneToMany(() => ProductRating, (productImage) => productImage.product)
    ratings: ProductRating[];
}
