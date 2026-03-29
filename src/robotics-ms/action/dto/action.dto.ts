import { IsNotEmpty, IsNumber } from "class-validator";

export class ExecuteActionDto {
  @IsNumber()
  @IsNotEmpty()
  action_id: number;

  @IsNumber()
  @IsNotEmpty()
  arduino_id: number;
}