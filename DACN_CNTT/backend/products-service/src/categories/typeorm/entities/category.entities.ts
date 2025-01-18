import { Product } from "src/products/typeorm/entities/product.entities";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'category' })
export class Category {
    @PrimaryGeneratedColumn('uuid')
    category_id: string;

    @Column({ nullable: false })
    category_name: string

    @Column({ nullable: true })
    category_description: string

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @Column({ nullable: false })
    createdAt: Date

    @Column({ nullable: false })
    updatedAt: Date
}