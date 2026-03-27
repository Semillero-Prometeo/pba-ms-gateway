import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configurations from 'src/core/settings/app.setting';
import { Payload } from 'src/core/interfaces/auth';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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

  validate(payload: Payload) {
    const { user } = payload;

    if (!user || user.roles.length === 0) {
      throw new UnauthorizedException('Token inválido o rol no encontrado');
    }

    return user;
  }
}
