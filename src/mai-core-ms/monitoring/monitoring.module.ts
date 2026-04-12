import { Module } from "@nestjs/common";
import { MonitoringController } from "./monitoring.controller";
import { NatsModule } from "src/transports/nats.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [NatsModule, AuthModule],
  controllers: [MonitoringController],
})
export class MonitoringModule {}