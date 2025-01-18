import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ShoppingCartItem } from "./shopping-cart-iteams.entities";


@Entity('shopping_carts')
export class ShoppingCart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    user_id: string;

    @OneToMany(() => ShoppingCartItem, (item) => item.shoppingCart, { cascade: true, onDelete: 'CASCADE' })
    items: ShoppingCartItem[];

    @Column({ type: 'decimal', precision: 1000, scale: 2, default: 0 })
    totalPrice: number;

    @Column({ nullable: false })
    createdAt: Date;

    @Column({ nullable: false })
    updatedAt: Date;
}
