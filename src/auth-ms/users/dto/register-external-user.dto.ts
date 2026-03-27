import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RegisterExternalUserDto {
  @IsNumber()
  @IsNotEmpty()
  document_type_id: number;

  @IsString()
  @IsNotEmpty()
  document_type_name: string;

  @IsString()
  @IsNotEmpty()
  document_id: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  country_name: string;
}
