import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RestorePasswordDto {
  @IsEmail()
  @IsOptional()
  @MaxLength(40)
  email: string;
}

export class SetPasswordDto {
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número o un caracter especial',
  })
  newPassword: string;
}
