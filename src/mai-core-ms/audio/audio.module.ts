import { Module } from "@nestjs/common";
import { NatsModule } from "src/transports/nats.module";
import { AuthModule } from "src/auth/auth.module";
import { AudioController } from "./audio.controller";

@Module({
  imports: [NatsModule, AuthModule],
  controllers: [AudioController],
})
export class AudioModule {}