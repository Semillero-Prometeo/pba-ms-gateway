import { Body, Controller, Delete, Get, Inject, Post, Query, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards';
import { NATS_SERVICE, ROBOTICS_MS } from 'src/core/constants/ms-names.constant';
import {
  SaveSequenceDto,
  ScanPcasDto,
  SequenceByNameDto,
  StartPlaybackDto,
} from './dto/sequence.dto';

@UseGuards(JwtAuthGuard)
@Controller('sequence')
export class SequenceController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get('arduinos')
  async listArduinos() {
    return this.client.send(`${ROBOTICS_MS}.sequenceService.listArduinos`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('pcas')
  async scanPcas(@Query() query: ScanPcasDto) {
    return this.client.send(`${ROBOTICS_MS}.sequenceService.scanPcas`, query).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('files')
  async listSequences() {
    return this.client.send(`${ROBOTICS_MS}.sequenceService.listSequences`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('file')
  async getSequence(@Query() query: SequenceByNameDto) {
    return this.client.send(`${ROBOTICS_MS}.sequenceService.getSequence`, query).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('file')
  async saveSequence(@Body() body: SaveSequenceDto) {
    return this.client.send(`${ROBOTICS_MS}.sequenceService.saveSequence`, body).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Delete('file')
  async deleteSequence(@Query() query: SequenceByNameDto) {
    return this.client.send(`${ROBOTICS_MS}.sequenceService.deleteSequence`, query).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('play')
  async startPlayback(@Body() body: StartPlaybackDto) {
    return this.client.send(`${ROBOTICS_MS}.sequenceService.startPlayback`, body).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('stop')
  async stopPlayback() {
    return this.client.send(`${ROBOTICS_MS}.sequenceService.stopPlayback`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
