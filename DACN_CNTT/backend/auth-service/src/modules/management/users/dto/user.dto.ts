import { Exclude } from "class-transformer";
import { RoleEntity } from "../../role/entity/roles.entity";

export class UserDTO {
    private id: string;

    private email: string;

    private fullName: string;

    private phone: string;
    @Exclude()
    private password: string;
    private isVerifid: boolean;
    private roles: RoleEntity[];
}