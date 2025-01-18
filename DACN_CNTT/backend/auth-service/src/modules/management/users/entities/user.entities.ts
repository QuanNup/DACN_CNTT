import { AbstractEntity } from "src/config/AbstractEntity";
import { RoleEntity } from "src/modules/management/role/entity/roles.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

export enum AccountType {
    GOOGLE = 'google',
    FACEBOOK = 'facebook',
    LOCAL = 'local',
}


@Entity('user')
export class UserEntity extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: false })
    email: string

    @Column({ nullable: true })
    password: string

    @Column({ nullable: true, select: false }) // Ẩn passwordStore khi query
    passwordStore?: string;

    @Column({ nullable: true })
    name: string

    @ManyToMany(() => RoleEntity, (role) => role.users, { cascade: true })
    @JoinTable({
        name: "user_role"
    })
    roles: RoleEntity[];

    @Column({ default: false })
    isActive: boolean;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    address?: string;

    @Column({ nullable: true })
    image?: string;

    @Column({
        type: 'enum',
        enum: AccountType,
        nullable: true, // Cho phép null trong trường hợp tài khoản không xác định loại
    })
    accountType: AccountType;
}
