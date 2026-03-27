import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PUBLIC_ROUTE } from 'src/core/decorators/public-routes.decorator';
import { Payload } from 'src/core/interfaces/auth';
import { SKIP_ACCESS_GUARD } from 'src/core/decorators/skip-access-guard.decorator';
import { UsersService } from 'src/auth-ms/users/users.service';
import { UserResponse } from 'src/auth-ms/users/interfaces/users';

@Injectable()
export class UserAccessGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  public extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE, [
      context.getHandler(),
      context.getClass(),
    ]);

    const skipGuard = this.reflector.getAllAndOverride<boolean>(SKIP_ACCESS_GUARD, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic || skipGuard) return true;

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const payload = this.jwtService.verify(token) as Payload;

      const user: UserResponse | null = await this.usersService.findOneUser(payload.user.id);

      if (!user) throw new UnauthorizedException('User not found');
      
      if (user.deleted_at) {
        throw new UnauthorizedException({
          message: 'Account disabled',
          reason: user.deleted_reason || 'No reason provided',
        });
      }

      // Attach user to request for later use
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Invalid token');
    }
  }
}
