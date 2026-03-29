import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { ActionController } from './action.controller';

@Module({
  imports: [NatsModule],
  controllers: [ActionController],
})
export class ActionModule {}
