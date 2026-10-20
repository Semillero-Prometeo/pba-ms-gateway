import { IsBoolean, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreatePhraseDto {
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  text: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9_]*$/)
  icon?: string;
}

export class UpdatePhraseDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  text?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9_]*$/)
  icon?: string;
}

export class SetPhraseActiveDto {
  @IsBoolean()
  active: boolean;
}
