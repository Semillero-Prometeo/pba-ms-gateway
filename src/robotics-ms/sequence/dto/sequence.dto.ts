import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MotionBlockDto {
  @IsInt()
  arduino_id: number;

  @IsInt()
  @Min(0)
  @Max(10)
  pca: number;

  @IsInt()
  @Min(0)
  @Max(15)
  servo: number;

  @IsNumber()
  @Min(0)
  inicio: number;

  @IsNumber()
  @Min(0.0001)
  dur: number;

  @IsInt()
  @Min(0)
  @Max(1000)
  pos: number;

  @IsInt()
  @Min(1)
  @Max(10)
  vel: number;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  nombre: string;
}

export class MotionSequenceDto {
  @IsInt()
  @Min(1)
  version: number;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MotionBlockDto)
  blocks: MotionBlockDto[];
}

export class SaveSequenceDto {
  @ValidateNested()
  @Type(() => MotionSequenceDto)
  sequence: MotionSequenceDto;

  @IsBoolean()
  @IsOptional()
  overwrite?: boolean;
}

export class SequenceByNameDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ScanPcasDto {
  @Type(() => Number)
  @IsInt()
  arduino_id: number;
}

export class StartPlaybackDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MotionBlockDto)
  blocks: MotionBlockDto[];
}

export class SequenceChainItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  @IsOptional()
  repeat?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(30000)
  @IsOptional()
  delay_ms?: number;
}

export class StartChainDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SequenceChainItemDto)
  items: SequenceChainItemDto[];
}
