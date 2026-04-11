import { Body, Controller, Get, Inject, Post, Query, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE, ROBOTICS_MS } from 'src/core/constants/ms-names.constant';
import { SpeakPayload } from './dto/voice.dto';
import { JwtAuthGuard } from 'src/auth/guards';

@UseGuards(JwtAuthGuard)
@Controller('voice')
export class VoiceController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('speak')
  async speak(@Body() body: SpeakPayload) {
    return this.client.send(`${ROBOTICS_MS}.voiceService.speak`, body).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
