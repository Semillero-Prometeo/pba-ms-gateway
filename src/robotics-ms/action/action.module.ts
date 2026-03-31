import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { ActionController } from './action.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [NatsModule, AuthModule],
  controllers: [ActionController],
})
export class ActionModule {}
