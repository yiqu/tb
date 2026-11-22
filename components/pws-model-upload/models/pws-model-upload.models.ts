import { PWS_MODEL_UPLOAD_PHASE, PWS_MODEL_UPLOAD_STATUS } from '../constants/pws-model-upload.constants';

export type PwsModelUploadStatus = (typeof PWS_MODEL_UPLOAD_STATUS)[keyof typeof PWS_MODEL_UPLOAD_STATUS];

export type PwsModelUploadPhase = (typeof PWS_MODEL_UPLOAD_PHASE)[keyof typeof PWS_MODEL_UPLOAD_PHASE];

/** One file that the user asked to upload. */
export interface PwsModelUploadItem {
  id: string;
  /** Files started with the same press of Upload share a batch id. */
  batchId: string;
  /** The name entered in the form. The backend saves the model under it instead of the file's own name. */
  name: string;
  modelKey: string;
  /** The selected file's own name, for display. */
  fileName: string;
  size: number;
  status: PwsModelUploadStatus;
  /** 0 to 100. */
  progress: number;
  /** Bytes the server has confirmed. */
  uploadedBytes: number;
  /** Smoothed upload speed, null until two progress updates were seen. Drives the time-left estimate. */
  bytesPerSecond: number | null;
  /** When `uploadedBytes` was last reported (ms since epoch), null before the first report. */
  progressUpdatedAt: number | null;
  /** The model artifact id (`AMAR-<uuid>`) the start request answered with, null until then. */
  artifactId: string | null;
  error: string | null;
  startedAt: number;
}

/** What one upload mutation needs: the store item it reports to and what the start request sends. */
export interface PwsModelUploadVariables {
  uploadId: string;
  file: File;
  name: string;
  modelKey: string;
}

/** What the Retry button needs: the uploads to start again, and the failed attempts to stop on the server. */
export interface PwsModelUploadRetryPlan {
  uploads: PwsModelUploadVariables[];
  abandonedUploads: PwsModelUploadItem[];
}
