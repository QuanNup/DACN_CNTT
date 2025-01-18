
import { AfterLoad, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../../users/entities/user.entities";
import dayjs from "dayjs";


@Entity("role")
export class RoleEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @CreateDateColumn()
    createDate: Date

    @UpdateDateColumn()
    lastUpdateDate: Date

    @ManyToMany(() => UserEntity, (user) => user.roles)
    users: UserEntity[]

}