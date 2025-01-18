import { IsNotEmpty } from "class-validator"

export class updateRolePermissionRequest {
    @IsNotEmpty()
    id: string
    permissionId: string[]
}