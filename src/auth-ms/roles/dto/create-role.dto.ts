import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Campo name debe ser un string' })
  @IsNotEmpty({ message: 'Campo name no debe estar vacío' })
  name: string;
}