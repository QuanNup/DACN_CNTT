import { StoreEntity } from "src/store/entities/store.entities";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";



@Entity({ name: 'rating' })
export class Rating {
    @PrimaryGeneratedColumn('uuid')
    rating_id: string;  // Khóa chính

    @Column({ type: 'int', nullable: false })
    stars: number;  // Số sao (rating), từ 1 đến 5

    @Column({ type: 'text', nullable: true })
    comment: string;  // Nhận xét của người dùng (tùy chọn)

    @Column({ nullable: false })
    user_id: string;  // ID của người đánh giá

    @ManyToOne(() => StoreEntity, (store) => store.ratings, { onDelete: 'CASCADE' })
    store: StoreEntity;  // Liên kết với cửa hàng được đánh giá

    @Column({ nullable: false })
    createdAt: Date;  // Ngày tạo đánh giá
}
