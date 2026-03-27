import { Module } from '@nestjs/common';
import { DocumentTypesController } from './document-types.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [DocumentTypesController],
})
export class DocumentTypesModule {}
