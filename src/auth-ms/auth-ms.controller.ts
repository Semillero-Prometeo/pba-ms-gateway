import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, Observable } from 'rxjs';
import { AUTH_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';
import { Public } from 'src/core/decorators/public-routes.decorator';
import { Health } from 'src/core/interfaces/health';

@Controller('auth-ms')
export class AuthMsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Public()
  @Get('health')
  health(): Observable<Health> {
    return this.client.send<Health>(`${AUTH_MS}.healthService.health`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
