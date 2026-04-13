/**
 * Mirrors PMAI Core ``visionService.getSnapshot`` JSON (camelCase from Pydantic serialize_by_alias).
 * Used for typing HTTP responses; runtime shape is validated loosely at the edge.
 */
export interface VisionCameraTileDto {
  cameraId: string;
  sourceType: string;
  devicePath: string;
  name: string;
  resolution: number[];
  fps: number;
  status: string;
  hasFrame: boolean;
  thumbnailJpegBase64: string | null;
  previewJpegBase64: string | null;
}

export interface VisionReidIdentityDto {
  globalId: string;
  camerasSeen: string[];
  crossCamera: boolean;
}

export interface VisionReidSummaryDto {
  totalIdentities: number;
  crossCameraIdentities: number;
  identities: VisionReidIdentityDto[];
}

/** Global object keys follow domain model (Spanish field names from Python). */
export interface VisionGlobalObjectDto {
  id_global: string;
  etiqueta: string;
  confianza: number;
  contexto: string | null;
  sensores: Record<string, unknown>;
  cameras_seen: string[];
  camera_id: string | null;
  bbox: [number, number, number, number] | null;
  image_base64: string | null;
}

export interface VisionSnapshotDto {
  schemaVersion: number;
  timestampMs: number;
  version: string;
  cameras: VisionCameraTileDto[];
  globalObjects: VisionGlobalObjectDto[];
  reidSummary: VisionReidSummaryDto;
}
