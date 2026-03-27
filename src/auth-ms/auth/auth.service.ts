import { Inject, Injectable } from '@nestjs/common';
import { AUTH_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { session } from '@prisma/client';
import { PrismaService } from 'src/core/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  async findOneSession(user_id: string): Promise<session | null> {
    return firstValueFrom<session | null>(
      this.client.send(`${AUTH_MS}.authService.findOneSession`, { user_id }).pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ),
    );
  }
}
