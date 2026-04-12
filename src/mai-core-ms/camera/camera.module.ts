import { Module } from "@nestjs/common";
import { CameraController } from "./camera.controller";
import { NatsModule } from "src/transports/nats.module";

@Module({
  imports: [NatsModule],
  controllers: [CameraController],
})
export class CameraModule {}