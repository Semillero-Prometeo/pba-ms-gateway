import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { ChatController } from './chat.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [NatsModule, AuthModule],
  controllers: [ChatController],
})
export class ChatModule {}
