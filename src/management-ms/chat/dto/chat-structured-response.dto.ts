import { IsString } from 'class-validator';

export class ChatStructuredResponseDto {
  @IsString()
  reply: string;
}
