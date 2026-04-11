import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { MANAGEMENT_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';
import { JwtAuthGuard } from 'src/auth/guards';
import { ChatStructuredRequestDto } from './dto/chat-structured-request.dto';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post("question")
  async chat(@Body() chatStructuredRequestDto: ChatStructuredRequestDto) {
    return this.client.send(`${MANAGEMENT_MS}.chatService.chat`, chatStructuredRequestDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
