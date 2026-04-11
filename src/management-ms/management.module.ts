import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { ManagementController } from './management.controller';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [NatsModule, ChatModule],
  controllers: [ManagementController],
})
export class ManagementMsModule {}
