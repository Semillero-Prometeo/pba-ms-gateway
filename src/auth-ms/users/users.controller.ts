import { Body, Controller, Get, Inject, Param, Patch, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { AUTH_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';
import { FindAllUsersQueryDto } from './dto/find-all-user.dto';
import { FindOneDto } from 'src/core/dto/find-one.dto';
import { ExtendedRequest } from 'src/core/interfaces/auth';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthUserDto } from './dto/update-user.dto';
import { InactiveUserDto } from './dto/delete-user.dto';
import { JwtAuthGuard } from 'src/auth/guards';
import { Public } from 'src/core/decorators/public-routes.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get()
  findAll(@Query() query: FindAllUsersQueryDto) {
    return this.client.send(`${AUTH_MS}.usersService.findAll`, query).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneDto) {
    return this.client.send(`${AUTH_MS}.usersService.findOne`, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    return this.client
      .send(`${AUTH_MS}.usersService.create`, {
        createUserDto,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Put(':id')
  updateAuthUser(
    @Param() { id }: FindOneDto,
    @Body() updateAuthUserDto: UpdateAuthUserDto,
    @Request() req: ExtendedRequest,
  ) {
    return this.client
      .send(`${AUTH_MS}.usersService.updateAuthUser`, {
        id,
        updateAuthUserDto,
        requestUser: req.user,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Patch('inactive')
  inactive(@Body() inactiveUserDto: InactiveUserDto, @Request() req: ExtendedRequest) {
    return this.client
      .send(`${AUTH_MS}.usersService.inactive`, {
        inactiveUserDto,
        requestUser: req.user,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Patch('active')
  active(@Body() inactiveUserDto: InactiveUserDto) {
    return this.client.send(`${AUTH_MS}.usersService.active`, inactiveUserDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
