import { Body, Controller, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE, ROBOTICS_MS } from 'src/core/constants/ms-names.constant';
import { SpeakPayload } from './dto/voice.dto';
import { CreatePhraseDto, SetPhraseActiveDto, UpdatePhraseDto } from './dto/phrase.dto';
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

  @Get('phrases')
  listPhrases() {
    return this.client.send(`${ROBOTICS_MS}.phraseService.list`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('phrases')
  createPhrase(@Body() body: CreatePhraseDto) {
    return this.client.send(`${ROBOTICS_MS}.phraseService.create`, body).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Patch('phrases/:id/active')
  setPhraseActive(@Param('id', ParseIntPipe) id: number, @Body() body: SetPhraseActiveDto) {
    return this.client.send(`${ROBOTICS_MS}.phraseService.setActive`, { id, active: body.active }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Patch('phrases/:id')
  updatePhrase(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePhraseDto) {
    return this.client.send(`${ROBOTICS_MS}.phraseService.update`, { id, ...body }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
