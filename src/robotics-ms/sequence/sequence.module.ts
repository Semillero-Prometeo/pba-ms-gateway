import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { NatsModule } from 'src/transports/nats.module';
import { SequenceController } from './sequence.controller';

@Module({
  imports: [NatsModule, AuthModule],
  controllers: [SequenceController],
})
export class SequenceModule {}
