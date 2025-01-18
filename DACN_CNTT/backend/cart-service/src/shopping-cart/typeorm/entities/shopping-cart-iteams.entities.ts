import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ShoppingCart } from './shopping-cart.entities';


@Entity('shopping_cart_items')
export class ShoppingCartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ShoppingCart, (cart) => cart.items, { onDelete: 'CASCADE' })
    shoppingCart: ShoppingCart;

    @Column({ nullable: false })
    product_id: string;

    @Column({ default: 1 })
    quantity: number;

    @Column({ nullable: false })
    price: number;

    @Column({ nullable: true })
    variant: string
}
