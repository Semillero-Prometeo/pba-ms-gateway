import { IsNotEmpty, IsString } from "class-validator";

export class SelectMicrophoneDto {
  @IsString()
  @IsNotEmpty()
  microphone_id: string;
}