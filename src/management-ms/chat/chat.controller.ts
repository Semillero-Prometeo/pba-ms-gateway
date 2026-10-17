import { Body, Controller, Get, Inject, Patch, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Roles } from '@prisma/client';
import { catchError } from 'rxjs';
import { MANAGEMENT_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { HasRoles } from 'src/core/decorators/roles.decorator';
import { ChatStructuredRequestDto } from './dto/chat-structured-request.dto';
import { SetAutomationDto } from './dto/set-automation.dto';
import { SetModelDto } from './dto/set-model.dto';

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

  @Post("poema")
  async declarePoema() {
    return this.client.send(`${MANAGEMENT_MS}.chatService.declarePoema`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('route')
  getRoute() {
    return this.client.send(`${MANAGEMENT_MS}.chatService.getRoute`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Patch('route/automation')
  @UseGuards(RolesGuard)
  @HasRoles(Roles.ADMIN)
  setAutomation(@Body() body: SetAutomationDto) {
    return this.client.send(`${MANAGEMENT_MS}.chatService.setAutomation`, body).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Patch('route/model')
  setModel(@Body() body: SetModelDto) {
    return this.client.send(`${MANAGEMENT_MS}.chatService.setModel`, body).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
