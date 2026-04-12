import { Controller, Get, Inject } from '@nestjs/common';
import { ROBOTICS_MS, NATS_SERVICE, MAI_CORE_MS } from 'src/core/constants/ms-names.constant';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Health } from 'src/core/interfaces/health';
import { catchError, Observable } from 'rxjs';
import { Public } from 'src/core/decorators/public-routes.decorator';

@Controller('mai-core-ms')
export class MaiCoreMsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Public()
  @Get('health')
  health(): Observable<Health> {
    return this.client.send<Health>(`${MAI_CORE_MS}.healthService.health`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
