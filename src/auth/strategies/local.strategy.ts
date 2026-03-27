import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { FirstTimeLoginUser } from 'src/auth-ms/users/interfaces/users';
import { UsersService } from 'src/auth-ms/users/users.service';
import { UserResponse } from 'src/auth-ms/users/interfaces/users';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'username' });
  }

  async validate(username: string, password: string) {
    const userOrFirstLogin: UserResponse | FirstTimeLoginUser | null = await this.usersService.validateUser(
      username,
      password,
    );

    if (!userOrFirstLogin) throw new UnauthorizedException('Email y/o contraseña incorrectos');

    // Handle first-time login
    const { requiresPasswordChange, resetToken } = userOrFirstLogin as FirstTimeLoginUser;
    if (requiresPasswordChange) {
      const welcomeName = userOrFirstLogin.person?.first_name || userOrFirstLogin.username;
      return {
        message: `¡Bienvenid@! ${welcomeName}. Por favor, establece una nueva contraseña para continuar.`,
        resetToken,
      };
    }

    return userOrFirstLogin;
  }
}
