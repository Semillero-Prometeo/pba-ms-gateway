import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { Inject } from "@nestjs/common";
import { MAI_CORE_MS, NATS_SERVICE } from "src/core/constants/ms-names.constant";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError } from "rxjs";
import { SelectMicrophoneDto } from "./dto/audio.dto";

@Controller('audio')
@UseGuards(JwtAuthGuard)
export class AudioController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}


  @Get('microphones')
  async getMicrophones() {
    return this.client.send(`${MAI_CORE_MS}.audioService.getMicrophones`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('select-microphone')
  async selectMicrophone(@Body() body: SelectMicrophoneDto) {
    return this.client.send(`${MAI_CORE_MS}.audioService.selectMicrophone`, body).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('start-listening')
  async startListening() {
    return this.client.send(`${MAI_CORE_MS}.audioService.startListening`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('stop-listening')
  async stopListening() {
    return this.client.send(`${MAI_CORE_MS}.audioService.stopListening`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('listening-status')
  async getListeningStatus() {
    return this.client.send(`${MAI_CORE_MS}.audioService.getListeningStatus`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}