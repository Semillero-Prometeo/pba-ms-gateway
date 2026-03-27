import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { configRoot } from './core/settings/app.setting';
import { NatsModule } from './transports/nats.module';
import { PrismaModule } from './core/database/database.module';
import { AuthMsModule } from './auth-ms/auth-ms.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(configRoot()),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    NatsModule,
    PrismaModule,
    AuthModule,
    AuthMsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
