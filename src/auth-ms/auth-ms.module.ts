import { Module } from '@nestjs/common';
import { DocumentTypesModule } from './document-types/document-types.module';
import { DepartmentsModule } from './departments/departments.module';
import { AuthMsController } from './auth-ms.controller';
import { NatsModule } from 'src/transports/nats.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PersonModule } from './person/person.module';
import { RolesModule } from './roles/roles.module';
import { AppSettingsModule } from './app-settings/app-settings.module';

@Module({
  imports: [
    NatsModule,
    PersonModule,
    AuthModule,
    DocumentTypesModule,
    DepartmentsModule,
    UsersModule,
    RolesModule,
    AppSettingsModule,
  ],
  controllers: [AuthMsController],
})
export class AuthMsModule {}
