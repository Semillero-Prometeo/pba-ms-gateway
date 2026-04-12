import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { MaiCoreMsController } from './mai-core-ms.controller';

@Module({
  imports: [NatsModule],
  controllers: [MaiCoreMsController],
})
export class MaiCoreMsModule {}
