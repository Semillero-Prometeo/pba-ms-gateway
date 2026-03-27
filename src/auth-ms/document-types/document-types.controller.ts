import { Controller, Get, Inject, Logger, Param } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { AUTH_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';

@Controller('document-types')
export class DocumentTypesController {
  private readonly logger = new Logger(DocumentTypesController.name);

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  findAll() {
    return this.client.send(`${AUTH_MS}.documentTypesService.findAll`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send(`${AUTH_MS}.documentTypesService.findOne`, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
