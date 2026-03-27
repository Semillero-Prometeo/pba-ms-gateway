import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { PasswordResetStrategy } from './strategies/password-reset.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserAccessGuard } from './guards/user-access.guard';
import { RolesGuard } from './guards/roles.guard';
import { NatsModule } from 'src/transports/nats.module';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import configurations from 'src/core/settings/app.setting';
import { UserAccessInterceptor } from 'src/core/interceptors/user-access.interceptor';
import { UsersModule } from 'src/auth-ms/users/users.module';
import { AuthService } from 'src/auth-ms/auth/auth.service';

@Module({
  imports: [
    PassportModule,
    NatsModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      inject: [configurations.KEY],
      useFactory(configEnvs: ConfigType<typeof configurations>) {
        return {
          secret: configEnvs.secret,
          signOptions: { expiresIn: '8d' },
        };
      },
    }),
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    LocalStrategy,
    PasswordResetStrategy,
    RefreshTokenStrategy,
    UserAccessGuard,
    RolesGuard,
    {
      provide: APP_GUARD,
      useClass: UserAccessGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserAccessInterceptor,
    },
    AuthService,
  ],
  exports: [UserAccessGuard, RolesGuard, JwtModule, AuthService, UsersModule],
})
export class AuthModule {}
