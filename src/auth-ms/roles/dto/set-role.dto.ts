import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SetRoleDto {
  @IsString({ message: 'El campo userId debe ser de tipo string' })
  @IsNotEmpty({ message: 'El campo userId no debe estar vacío' })
  user_id: string;

  @IsArray({ message: 'El campo rolesId debe ser un array' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos un roleId' })
  @IsString({ each: true, message: 'Cada roleId debe ser de tipo string' })
  roles_id: string[];
}
