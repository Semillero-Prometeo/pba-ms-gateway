import { IsIn, IsString } from 'class-validator';

export class SetModelDto {
  @IsString()
  @IsIn(['basico', 'complejo'])
  model: 'basico' | 'complejo';
}
