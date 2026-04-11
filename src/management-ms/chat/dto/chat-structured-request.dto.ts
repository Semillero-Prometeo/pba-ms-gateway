import { IsNotEmpty, IsString } from 'class-validator';

export class ChatStructuredRequestDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
