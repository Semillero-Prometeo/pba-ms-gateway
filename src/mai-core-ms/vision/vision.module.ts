import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { NatsModule } from 'src/transports/nats.module';
import { VisionGateway } from './vision.gateway';
import { VisionHttpController } from './vision-http.controller';
import { VisionWsAuthService } from './vision-ws-auth.service';

@Module({
  imports: [NatsModule, AuthModule],
  controllers: [VisionHttpController],
  providers: [VisionGateway, VisionWsAuthService],
})
export class VisionModule {}
