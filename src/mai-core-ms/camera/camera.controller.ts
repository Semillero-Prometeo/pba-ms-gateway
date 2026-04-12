import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { MAI_CORE_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';

@Controller('camera')
export class CameraController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  getCameras() {
    return this.client.send(`${MAI_CORE_MS}.cameraService.getCameras`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
