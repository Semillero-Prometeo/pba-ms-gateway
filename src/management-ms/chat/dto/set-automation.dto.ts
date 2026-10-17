import { IsBoolean } from 'class-validator';

export class SetAutomationDto {
  @IsBoolean()
  enabled: boolean;
}
