import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { MaiCoreMsController } from './mai-core-ms.controller';
import { CameraModule } from './camera/camera.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { VisionModule } from './vision/vision.module';

@Module({
  imports: [NatsModule, CameraModule, MonitoringModule, VisionModule],
  controllers: [MaiCoreMsController],
})
export class MaiCoreMsModule {}
