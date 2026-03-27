import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configurations from 'src/core/settings/app.setting';

export interface ResetPasswordPayload {
  sub: string;
  type: 'password-reset';
}

@Injectable()
export class PasswordResetStrategy extends PassportStrategy(Strategy, 'password-reset') {
  constructor(
    @Inject(configurations.KEY)
    private readonly configService: ConfigType<typeof configurations>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.restorePasswordSecret,
    });
  }

  validate(payload: ResetPasswordPayload) {
    if (!payload.sub || payload.type !== 'password-reset') {
      throw new UnauthorizedException('Token de reset de contraseña inválido');
    }

    return payload;
  }
}
