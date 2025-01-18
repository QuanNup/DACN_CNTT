import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Role } from 'src/config/enum/role';


export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

export const RESPONSE_MESSAGE = 'response_message'
export const ResponseMessage = (message: string) =>
    SetMetadata(RESPONSE_MESSAGE, message);


export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const AddPublicFlag = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        req.isPublic = true; // Gán isPublic flag vào request
        return req;
    },
);
