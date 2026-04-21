import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC_ROUTE } from 'src/core/decorators/public-routes.decorator';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/auth-ms/users/users.service';
import { UserResponse } from 'src/auth-ms/users/interfaces/users';
import { AuthService } from 'src/auth-ms/auth/auth.service';
import { session } from '@prisma/client';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async validateSession(user_id: string, token: string) {
    const session: session | null = await this.authService.findOneSession(user_id);

    if (!session) throw new UnauthorizedException('Sesión no encontrada. Inicie sesión nuevamente');

    if (session.token !== token)
      throw new UnauthorizedException('Esta sesión no se encuentra activa. Inicie sesión nuevamente');

    if (session.expires_at < new Date()) throw new UnauthorizedException('Sesión expirada. Inicie sesión nuevamente');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const baseCanActivate = await super.canActivate(context);
    if (!baseCanActivate) return false;

    // const token = this.extractTokenFromHeader(request);

    // await this.validateSession(request.user.id, token);

    const user: UserResponse = await this.usersService.findOneUser(request.user.id);

    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const activeRole = request.headers['x-active-role'];

    if (!activeRole) throw new ForbiddenException('No se ha especificado un rol activo');

    if (!user.user_role.map((ur) => ur.role.id).includes(activeRole)) {
      throw new ForbiddenException({
        message: `El rol ${activeRole} no está asignado al usuario ${user.id}`,
      });
    }

    return true;
  }
}
