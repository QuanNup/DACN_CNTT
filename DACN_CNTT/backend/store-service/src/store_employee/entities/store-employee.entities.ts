
import { StoreEntity } from "src/store/entities/store.entities";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('store_employees')
export class StoreEmployeeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => StoreEntity, (store) => store.store_id, { nullable: false })
    @JoinColumn({ name: 'store_id' })
    store: StoreEntity;

    @Column()
    employee_id: string;

    @Column({ type: 'enum', enum: ['MANAGER', 'STAFF'], default: 'STAFF' })
    role: 'MANAGER' | 'STAFF';

    @Column({ nullable: false })
    createdAt: Date
}



// @ManyToOne(() => StoreRolesEntity, (role) => role.id, { nullable: false })
// @JoinColumn({ name: 'role_id' })
// role: StoreRolesEntity[];