import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards';
import { MAI_CORE_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';

@Controller('camera')
@UseGuards(JwtAuthGuard)
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

  @Get('/:camera_id')
  getCameraView(@Param('camera_id') camera_id: string) {
    return this.client.send(`${MAI_CORE_MS}.cameraService.getCameraView`, { camera_id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
