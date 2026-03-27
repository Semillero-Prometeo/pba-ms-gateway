import { Module } from '@nestjs/common';
import { AppSettingsController } from './app-settings.controller';
import { NatsModule } from 'src/transports/nats.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [NatsModule, UsersModule, AuthModule],
  controllers: [AppSettingsController],
})
export class AppSettingsModule {}
