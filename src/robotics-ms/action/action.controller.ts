import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE, ROBOTICS_MS } from 'src/core/constants/ms-names.constant';
import { ExecuteActionDto } from './dto/action.dto';

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

  @Post('execute')
  async executeAction(@Body() executeActionDto: ExecuteActionDto) {
    return this.client.send(`${ROBOTICS_MS}.actionService.executeAction`, executeActionDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
