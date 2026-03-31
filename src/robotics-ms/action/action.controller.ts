import { Body, Controller, Get, Inject, Post, Query, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE, ROBOTICS_MS } from 'src/core/constants/ms-names.constant';
import { ExecuteActionDto } from './dto/action.dto';
import { JwtAuthGuard } from 'src/auth/guards';

@UseGuards(JwtAuthGuard)
@Controller('action')
export class ActionController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get('actions')
  async getActions() {
    return this.client.send(`${ROBOTICS_MS}.actionService.getActions`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('execute')
  async executeAction(@Query() { action_id, arduino_id }: ExecuteActionDto) {
    return this.client.send(`${ROBOTICS_MS}.actionService.executeAction`, { action_id, arduino_id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
