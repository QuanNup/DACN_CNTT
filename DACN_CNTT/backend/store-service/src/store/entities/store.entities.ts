
import { StoreEmployeeEntity } from "src/store_employee/entities/store-employee.entities";
import { Rating } from "src/rating/typeorm/entities/rating-store.entities";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'store' })
export class StoreEntity {
    @PrimaryGeneratedColumn('uuid')
    store_id: string;

    @Column({ nullable: false })
    store_name: string

    @Column({ nullable: true })
    store_description: string

    @Column({ nullable: false })
    owner_id: string

    @OneToMany(() => Rating, (rating) => rating.store)
    ratings: Rating[];

    @Column({ type: 'float', default: 0 })
    average_rating: number

    @Column({ type: 'enum', enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' })
    status: 'PENDING' | 'APPROVED' | 'REJECTED';

    @OneToMany(() => StoreEmployeeEntity, (employee) => employee.store, { cascade: true })
    employees: StoreEmployeeEntity[];

    @Column({ nullable: false })
    createdAt: Date

    @Column({ nullable: false })
    updatedAt: Date
}