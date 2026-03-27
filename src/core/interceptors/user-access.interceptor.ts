import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/auth-ms/users/users.service';
import { UserResponse } from 'src/auth-ms/users/interfaces/users';

@Injectable()
export class UserAccessInterceptor implements NestInterceptor {
  constructor(private readonly usersService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;

    if (userId) {
      const user: UserResponse = await this.usersService.findOneUser(userId);

      if (user?.deleted_at) {
        throw new UnauthorizedException({
          message: 'Account disabled',
          reason: user.deleted_reason || 'No reason provided',
        });
      }
    }

    return next.handle();
  }
}
