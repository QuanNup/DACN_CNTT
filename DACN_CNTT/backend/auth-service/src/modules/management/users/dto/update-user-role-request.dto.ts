
import { IsNotEmpty } from "class-validator";

export class updateUserRoleRequest {
    @IsNotEmpty()
    id: string

    @IsNotEmpty()
    roleId: string[];

    isVerified: boolean;
}