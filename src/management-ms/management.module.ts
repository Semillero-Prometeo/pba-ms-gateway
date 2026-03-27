import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { ManagementController } from './management.controller';

@Module({
  imports: [NatsModule],
  controllers: [ManagementController],
})
export class ManagementMsModule {}
