import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/** Query params for ``GET /vision/snapshot`` (same payload shape as NATS / WS). */
export class VisionSnapshotQueryDto {
  @IsOptional()
  @IsString()
  selectedCameraId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(32)
  @Max(640)
  thumbMaxWidth?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(160)
  @Max(1920)
  previewMaxWidth?: number;
}
