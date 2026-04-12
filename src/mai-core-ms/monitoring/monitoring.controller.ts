import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards';
import { MAI_CORE_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';

@Controller('monitoring')
@UseGuards(JwtAuthGuard)
export class MonitoringController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get('objects')
  getObjects() {
    return this.client.send(`${MAI_CORE_MS}.monitoringService.getObjects`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('trackers')
  getTrackers() {
    return this.client.send(`${MAI_CORE_MS}.monitoringService.getTrackers`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('tracked-objects')
  getTrackedObjects() {
    return this.client.send(`${MAI_CORE_MS}.monitoringService.getTrackedObjects`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('reid-status')
  getReidStatus() {
    return this.client.send(`${MAI_CORE_MS}.monitoringService.getReidStatus`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
