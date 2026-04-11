import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { VoiceController } from './voice.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [NatsModule, AuthModule],
  controllers: [VoiceController],
})
export class VoiceModule {}
