import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '@prisma/client';
import { PUBLIC_ROUTE } from 'src/core/decorators/public-routes.decorator';
import { ExtendedRequest } from 'src/core/interfaces/auth';
import { UsersService } from 'src/auth-ms/users/users.service';
import { ROLES_KEY } from 'src/core/decorators/roles.decorator';
import { UserResponse, UserRoleResponse } from 'src/auth-ms/users/interfaces/users';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<ExtendedRequest>();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    const user: UserResponse = await this.usersService.findOneUser(userId);

    if (!user || !user.user_role?.length) {
      throw new ForbiddenException('Acceso no autorizado, sin roles asignados');
    }

    const raw = request.headers['x-active-role'];
    const activeRoleId = Array.isArray(raw) ? raw[0] : raw;
    const active = user.user_role.find((ur: UserRoleResponse) => ur.role && ur.role.id === activeRoleId);
    if (!active || !active.role.name || !requiredRoles.includes(active.role.name as Roles)) {
      throw new ForbiddenException('No tiene permisos para acceder a este recurso');
    }

    return true;
  }
}
