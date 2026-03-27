import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Query,
  Inject,
  Logger,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { JwtAuthGuard } from 'src/auth/guards';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { FindAllPersonsDto } from './dto/find-person.dto';
import { AUTH_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';
import { FindOneDto } from 'src/core/dto/find-one.dto';
import { Public } from 'src/core/decorators/public-routes.decorator';

@Controller('person')
@UseGuards(JwtAuthGuard)
export class PersonController {
  private readonly logger = new Logger(PersonController.name);

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  @Public()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.client.send(`${AUTH_MS}.personService.create`, createPersonDto).pipe(
      catchError((error) => {
        this.logger.error('[ERROR] PersonController.create', error);
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  findAll(@Query() query: FindAllPersonsDto) {
    return this.client.send(`${AUTH_MS}.personService.findAll`, query).pipe(
      catchError((error) => {
        this.logger.error('[ERROR] PersonController.findAll', error);
        throw new RpcException(error);
      }),
    );
  }

  @Get(':id')
  findOne(@Param(new ValidationPipe({ transform: true })) { id }: FindOneDto) {
    return this.client.send(`${AUTH_MS}.personService.findOne`, { id }).pipe(
      catchError((error) => {
        this.logger.error('[ERROR] PersonController.findOne', error);
        throw new RpcException(error);
      }),
    );
  }

  @Put(':id')
  update(@Param(new ValidationPipe({ transform: true })) { id }: FindOneDto, @Body() updatePersonDto: UpdatePersonDto) {
    return this.client.send(`${AUTH_MS}.personService.update`, { id, updatePersonDto }).pipe(
      catchError((error) => {
        this.logger.error('[ERROR] PersonController.update', error);
        throw new RpcException(error);
      }),
    );
  }

  @Delete(':id')
  remove(@Param(new ValidationPipe({ transform: true })) { id }: FindOneDto) {
    return this.client.send(`${AUTH_MS}.personService.remove`, { id }).pipe(
      catchError((error) => {
        this.logger.error('[ERROR] PersonController.remove', error);
        throw new RpcException(error);
      }),
    );
  }
}
