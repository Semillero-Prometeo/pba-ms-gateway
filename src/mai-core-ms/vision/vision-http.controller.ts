import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards';
import { MAI_CORE_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';
import { VisionSnapshotQueryDto } from './dtos/vision-snapshot-query.dto';
import { VisionSnapshotDto } from './dtos/vision-snapshot-response.dto';

@Controller('vision')
@UseGuards(JwtAuthGuard)
export class VisionHttpController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get('snapshot')
  getSnapshot(@Query() query: VisionSnapshotQueryDto) {
    const payload = {
      selectedCameraId: query.selectedCameraId ?? null,
      thumbMaxWidth: query.thumbMaxWidth ?? 160,
      previewMaxWidth: query.previewMaxWidth ?? 640,
    };
    return this.client.send<VisionSnapshotDto>(`${MAI_CORE_MS}.visionService.getSnapshot`, payload).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
