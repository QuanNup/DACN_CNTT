
import { StoreEntity } from "src/store/entities/store.entities";
import { StoreEmployeeEntity } from "src/store_employee/entities/store-employee.entities";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('store_roles')
export class StoreRolesEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    // @OneToMany(() => StoreEmployeeEntity, (employee) => employee.role)
    // employees: StoreEmployeeEntity[];
}
