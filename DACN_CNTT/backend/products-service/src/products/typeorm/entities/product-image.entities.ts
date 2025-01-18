import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./product.entities";

@Entity({ name: 'product_image' })
export class ProductImage {
    @PrimaryGeneratedColumn('uuid')
    image_id: string;

    @ManyToOne(() => Product, (product) => product.images, { nullable: false })
    product: Product;

    @Column({ nullable: false })
    url: string; // Đường dẫn hình ảnh

    @Column({ nullable: false })
    variants: string;
}
