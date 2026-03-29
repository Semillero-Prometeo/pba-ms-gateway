import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { RoboticsMsController } from './robotics-ms.controller';
import { ActionModule } from './action/action.module';

@Module({
  imports: [NatsModule, ActionModule],
  controllers: [RoboticsMsController],
})
export class RoboticsMsModule {}
