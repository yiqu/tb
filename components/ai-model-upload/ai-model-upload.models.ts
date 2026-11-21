import { AI_MODEL_UPLOAD_PHASE, AI_MODEL_UPLOAD_STATUS } from './ai-model-upload.constants';

export type AiModelUploadStatus = (typeof AI_MODEL_UPLOAD_STATUS)[keyof typeof AI_MODEL_UPLOAD_STATUS];

export type AiModelUploadPhase = (typeof AI_MODEL_UPLOAD_PHASE)[keyof typeof AI_MODEL_UPLOAD_PHASE];

/** One file that the user asked to upload. */
export interface AiModelUploadItem {
  id: string;
  /** Files started with the same press of Upload share a batch id. */
  batchId: string;
  /** The name entered in the form. The backend saves the model under it instead of the file's own name. */
  name: string;
  modelKey: string;
  /** The selected file's own name, for display. */
  fileName: string;
  size: number;
  status: AiModelUploadStatus;
  /** 0 to 100. */
  progress: number;
  /** The model artifact id (`AMAR-<uuid>`) the start request answered with, null until then. */
  artifactId: string | null;
  error: string | null;
  startedAt: number;
}

/** What one upload mutation needs: the store item it reports to and what the start request sends. */
export interface AiModelUploadVariables {
  uploadId: string;
  file: File;
  name: string;
  modelKey: string;
  /** Set on a retry: the model artifact id of the failed attempt, so the upload continues from where the server got to. */
  resumeArtifactId: string | null;
}
