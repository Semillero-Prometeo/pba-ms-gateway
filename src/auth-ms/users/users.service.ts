import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { AUTH_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';
import { UserResponse } from './interfaces/users';
import { FirstTimeLoginUser } from './interfaces/users';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  findOneUser(id: string): Promise<UserResponse> {
    return firstValueFrom<UserResponse>(
      this.client.send(`${AUTH_MS}.usersService.findOne`, { id }).pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ),
    );
  }

  validateUser(username: string, password: string): Promise<UserResponse | FirstTimeLoginUser | null> {
    return firstValueFrom<UserResponse | FirstTimeLoginUser | null>(
      this.client
        .send(`${AUTH_MS}.authService.validateUser`, {
          username,
          password,
        })
        .pipe(
          catchError((error) => {
            this.logger.error('[ERROR] LocalStrategy.validate', error);
            throw new RpcException(error);
          }),
        ),
    );
  }
}
