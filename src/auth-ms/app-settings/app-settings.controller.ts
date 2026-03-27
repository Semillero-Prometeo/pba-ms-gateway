import { Controller, Get, Body, Patch, Param, Inject, Query, UseGuards } from '@nestjs/common';
import { NATS_SERVICE } from 'src/core/constants/ms-names.constant';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { AUTH_MS } from 'src/core/constants/ms-names.constant';
import { AppSettingsDto, AppSettingsUpdateManyDto } from './dto/app-settings.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AppSettings } from '@prisma/client';

@Controller('app-settings')
@UseGuards(JwtAuthGuard)
export class AppSettingsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  findAll() {
    return this.client.send(`${AUTH_MS}.appSettingsService.findAll`, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get(':id')
  getSetting(@Param('id') id: AppSettings, @Query('startAt') startAt?: Date) {
    return this.client
      .send(`${AUTH_MS}.appSettingsService.getSetting`, {
        id,
        startAt,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Patch('many')
  updateMany(@Body() appSettingsUpdateManyDto: AppSettingsUpdateManyDto) {
    return this.client.send(`${AUTH_MS}.appSettingsService.updateMany`, appSettingsUpdateManyDto);
  }

  @Patch(':id')
  update(@Param('id') id: AppSettings, @Body() appSettingsDto: AppSettingsDto) {
    return this.client
      .send(`${AUTH_MS}.appSettingsService.update`, {
        id,
        appSettingsDto,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
