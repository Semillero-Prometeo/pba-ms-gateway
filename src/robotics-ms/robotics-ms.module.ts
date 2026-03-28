import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { RoboticsMsController } from './robotics-ms.controller';

@Module({
  imports: [NatsModule],
  controllers: [RoboticsMsController],
})
export class RoboticsMsModule {}
