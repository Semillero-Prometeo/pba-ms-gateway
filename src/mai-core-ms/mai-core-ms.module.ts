import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { MaiCoreMsController } from './mai-core-ms.controller';
import { CameraModule } from './camera/camera.module';

@Module({
  imports: [NatsModule, CameraModule],
  controllers: [MaiCoreMsController],
})
export class MaiCoreMsModule {}
