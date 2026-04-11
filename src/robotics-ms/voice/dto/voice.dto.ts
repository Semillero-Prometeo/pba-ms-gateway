import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SpeakPayload {
  @IsString()
  @IsNotEmpty()
  message: string;
}