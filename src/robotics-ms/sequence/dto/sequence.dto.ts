import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
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
  @IsOptional()
  @IsInt()
  @Min(1)
  version?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(280)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  arduino_id?: number;

  @IsString()
  @IsIn(['cara', 'cuello', 'brazo_derecho', 'brazo_izquierdo', 'torso', 'cadera'])
  category: string;

  @IsArray()
  @ArrayMinSize(1)
  blocks: unknown[];

  @IsArray()
  @ArrayMinSize(1)
  blocks_neutro: unknown[];
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

@ValidatorConstraint({ name: 'nameOrBlocks', async: false })
class NameOrBlocksConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const obj = args.object as StartPlaybackDto;
    return Boolean(obj.name) || (Array.isArray(obj.blocks) && obj.blocks.length > 0);
  }

  defaultMessage() {
    return 'Indique name o blocks';
  }
}

export class StartPlaybackDto {
  @Validate(NameOrBlocksConstraint)
  @IsOptional()
  @IsIn(['normal', 'neutro'])
  mode?: 'normal' | 'neutro';

  @IsOptional()
  @IsIn(['panel', 'estudio'])
  source?: 'panel' | 'estudio';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MotionBlockDto)
  blocks?: MotionBlockDto[];
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
