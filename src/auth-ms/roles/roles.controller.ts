import { Controller, Get, Post, Body, Param, Delete, Inject, Query, Logger, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AUTH_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';
import { catchError } from 'rxjs';
import { FindAllQueryDto } from 'src/core/dto/find-all-query.dto';
import { SetRoleDto } from './dto/set-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    return this.client.send(`${AUTH_MS}.rolesService.findAll`, query).pipe(
      catchError((error) => {
        Logger.error('[ERROR] RolesController.findAll', error);
        throw new RpcException(error);
      }),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send(`${AUTH_MS}.rolesService.findOne`, { id }).pipe(
      catchError((error) => {
        Logger.error('[ERROR] RolesController.findOne', error);
        throw new RpcException(error);
      }),
    );
  }

  @Post('set-roles')
  setRoles(@Body() setRolesDto: SetRoleDto) {
    return this.client.send(`${AUTH_MS}.rolesService.setRoles`, setRolesDto).pipe(
      catchError((error) => {
        Logger.error('[ERROR] RolesController.setRoles', error);
        throw new RpcException(error);
      }),
    );
  }

  @Post('create-role')
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.client.send(`${AUTH_MS}.rolesService.createRole`, createRoleDto).pipe(
      catchError((error) => {
        Logger.error('[ERROR] RolesController.createRole', error);
        throw new RpcException(error);
      }),
    );
  }

  @Delete('delete-role/:id')
  deleteRole(@Param('id') id: string) {
    return this.client.send(`${AUTH_MS}.rolesService.deleteRole`, id).pipe(
      catchError((error) => {
        Logger.error('[ERROR] RolesController.deleteRole', error);
        throw new RpcException(error);
      }),
    );
  }
}
