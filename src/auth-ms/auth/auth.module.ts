import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { NatsModule } from 'src/transports/nats.module';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [NatsModule, forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
