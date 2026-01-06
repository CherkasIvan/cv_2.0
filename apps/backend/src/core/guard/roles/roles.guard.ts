import { ROLES_KEY } from '@common/decorators/roles.decorator';
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        if (!user.roles) {
            throw new ForbiddenException('User has no roles assigned');
        }

        const hasRequiredRole = requiredRoles.some((role) =>
            user.roles.includes(role),
        );

        if (!hasRequiredRole) {
            throw new ForbiddenException(
                `Insufficient permissions. Required roles: ${requiredRoles.join(', ')}`,
            );
        }

        return true;
    }
}
