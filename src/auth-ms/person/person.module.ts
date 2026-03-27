import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { NatsModule } from 'src/transports/nats.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [NatsModule, AuthModule, UsersModule],
  controllers: [PersonController],
})
export class PersonModule {}
