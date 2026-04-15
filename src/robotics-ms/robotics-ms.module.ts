import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { RoboticsMsController } from './robotics-ms.controller';
import { ActionModule } from './action/action.module';
import { VoiceModule } from './voice/voice.module';
import { SequenceModule } from './sequence/sequence.module';

@Module({
  imports: [NatsModule, ActionModule, VoiceModule, SequenceModule],
  controllers: [RoboticsMsController],
})
export class RoboticsMsModule {}
