import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { RoboticsMsController } from './robotics-ms.controller';
import { ActionModule } from './action/action.module';
import { VoiceModule } from './voice/voice.module';

@Module({
  imports: [NatsModule, ActionModule, VoiceModule],
  controllers: [RoboticsMsController],
})
export class RoboticsMsModule {}
