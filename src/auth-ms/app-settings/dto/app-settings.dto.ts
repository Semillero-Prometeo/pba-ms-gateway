import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNotEmpty, IsObject, ValidateNested, IsArray, IsEnum, IsDate } from 'class-validator';
import { AppSettings } from '@prisma/client';
import { UpdateSettingCategory } from '../enums/update-setting.enum';

export class AppSettingsDto {
  @IsEnum(AppSettings)
  @IsOptional()
  key?: AppSettings;

  @IsString({ message: 'El campo value debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo value es requerido' })
  value: string;

  @IsOptional()
  @IsDate({ message: 'El campo startAt debe ser una fecha válida' })
  @Type(() => Date)
  startAt?: Date;
}

export class AppSettingsUpdateManyDto {
  @IsArray()
  @ValidateNested()
  @Type(() => AppSettingsDto)
  @IsNotEmpty({ message: 'El campo appSettingsDto es requerido' })
  appSettingsDto: AppSettingsDto[];

  @IsEnum(UpdateSettingCategory)
  @IsNotEmpty({ message: 'El campo updateSettingCategory es requerido' })
  updateSettingCategory: UpdateSettingCategory;
}

export class AppSettingsPayload {
  @IsString()
  @IsNotEmpty({ message: 'El campo id es requerido' })
  id: string;

  @IsObject()
  @ValidateNested()
  @Type(() => AppSettingsDto)
  appSettingsDto: AppSettingsDto;
}
