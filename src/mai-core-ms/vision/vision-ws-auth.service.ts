import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';
import { AuthService } from 'src/auth-ms/auth/auth.service';
import { UsersService } from 'src/auth-ms/users/users.service';
import { Payload } from 'src/core/interfaces/auth';

@Injectable()
export class VisionWsAuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Same rules as ``JwtAuthGuard`` for HTTP: valid JWT, active DB session, and ``activeRole`` assigned.
   * Query: ``access_token``, ``activeRole`` (WebSocket cannot send custom headers from the browser).
   */
  async verifyUpgradeRequest(req: IncomingMessage | undefined): Promise<void> {
    if (!req?.url) {
      throw new UnauthorizedException('Missing request');
    }
    const host = req.headers.host ?? '127.0.0.1';
    const url = new URL(req.url, `http://${host}`);
    const token = url.searchParams.get('access_token');
    const activeRole = url.searchParams.get('activeRole');
    if (!token || !activeRole) {
      throw new UnauthorizedException('access_token and activeRole query parameters are required');
    }

    let decoded: Payload;
    try {
      decoded = this.jwt.verify<Payload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const userId = decoded.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const session = await this.authService.findOneSession(userId);
    if (!session) {
      throw new UnauthorizedException('Sesión no encontrada. Inicie sesión nuevamente');
    }
    if (session.token !== token) {
      throw new UnauthorizedException('Esta sesión no se encuentra activa. Inicie sesión nuevamente');
    }
    if (session.expires_at < new Date()) {
      throw new UnauthorizedException('Sesión expirada. Inicie sesión nuevamente');
    }

    const user = await this.usersService.findOneUser(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const roleIds = user.user_role.map((ur) => ur.role.id);
    if (!roleIds.includes(activeRole)) {
      throw new ForbiddenException(`El rol ${activeRole} no está asignado al usuario`);
    }
  }
}
