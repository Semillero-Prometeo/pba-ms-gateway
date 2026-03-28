import { Controller, Get, Inject } from '@nestjs/common';
import { ROBOTICS_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Health } from 'src/core/interfaces/health';
import { catchError, Observable } from 'rxjs';
import { Public } from 'src/core/decorators/public-routes.decorator';

@Controller('robotics-ms')
export class RoboticsMsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Public()
  @Get('health')
  health(): Observable<Health> {
    return this.client.send<Health>(`${ROBOTICS_MS}.healthService.health`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
