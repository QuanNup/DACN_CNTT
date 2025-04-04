// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Role } from './roles.enum';
// import { ROLES_KEY } from 'src/config/decorator/customize';

// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(private reflector: Reflector) { }

//     canActivate(context: ExecutionContext): boolean {
//         const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//             context.getHandler(),
//             context.getClass(),
//         ]);

//         if (!requiredRoles) {
//             return true; // Nếu không yêu cầu vai trò, thì cho phép truy cập
//         }

//         const { user } = context.switchToHttp().getRequest();

//         return requiredRoles.some((role) => user.role?.includes(role)); // Kiểm tra người dùng có vai trò phù hợp không
//     }
// }
