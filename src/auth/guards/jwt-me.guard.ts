import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/core/database/database.service';
import { ExtendedRequest } from 'src/core/interfaces/auth';
@Injectable()
export class JwtMeAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly prismaService: PrismaService,
  ) {
    super();
  }

  private extractTokenFromHeader(request: ExtendedRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async validateSession(user_id: string, token: string) {
    const where = { user_id, deleted_at: null }

    const session = await this.prismaService.session.findFirst({ where });

    if (!session) throw new UnauthorizedException('Sesión no encontrada. Inicie sesión nuevamente');

    if (session.token !== token) throw new UnauthorizedException('Esta sesión no se encuentra activa. Inicie sesión nuevamente');

    if (session.expires_at < new Date()) throw new UnauthorizedException('Sesión expirada. Inicie sesión nuevamente');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: ExtendedRequest = context.switchToHttp().getRequest();

    const baseCanActivate = await super.canActivate(context);
    if (!baseCanActivate) return false;

    const token = this.extractTokenFromHeader(request);

    await this.validateSession(request.user.id, token);

    return true;
  }
}
