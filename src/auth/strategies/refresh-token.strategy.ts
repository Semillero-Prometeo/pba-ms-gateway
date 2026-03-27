import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import configurations from 'src/core/settings/app.setting';
import { Payload } from 'src/core/interfaces/auth';

export interface RefreshTokenPayload extends Payload {
  type: 'refresh';
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(
    @Inject(configurations.KEY)
    private readonly configService: ConfigType<typeof configurations>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.secret,
    });
  }

  validate(payload: RefreshTokenPayload) {
    const { user } = payload;

    if (!user || !user.id || payload.type !== 'refresh') {
      throw new UnauthorizedException('Token de refresh inválido: usuario no encontrado en el payload');
    }

    return payload;
  }
}
