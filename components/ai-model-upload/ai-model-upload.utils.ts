import { AI_MODEL_UPLOAD_PHASE, AI_MODEL_UPLOAD_STATUS, AI_MODEL_UPLOAD_MAX_CHUNK_BYTES, AI_MODEL_UPLOAD_MIN_CHUNK_COUNT } from './ai-model-upload.constants';

import type { AiModelUploadItem, AiModelUploadPhase } from './ai-model-upload.models';

/** `'.TXT'`, `'txt'` and `' .txt '` all become `'.txt'`. */
export function normalizeFileExtension(extension: string): string {
  const trimmed: string = extension.trim().toLowerCase();
  if (trimmed === '') {
    return '';
  }
  return trimmed.startsWith('.') ? trimmed : `.${trimmed}`;
}

/** The last extension of a file name including the dot and lower cased, `''` when there is none. Multi-part extensions such as `.tar.gz` are not supported. */
export function getFileExtension(fileName: string): string {
  const lastDotIndex: number = fileName.lastIndexOf('.');
  if (lastDotIndex <= 0 || lastDotIndex === fileName.length - 1) {
    return '';
  }
  return fileName.slice(lastDotIndex).toLowerCase();
}

/** An empty or missing list allows every file. */
export function isFileExtensionAllowed(fileName: string, allowedExtensions?: readonly string[]): boolean {
  if (!allowedExtensions || allowedExtensions.length === 0) {
    return true;
  }
  const extension: string = getFileExtension(fileName);
  return allowedExtensions.map(normalizeFileExtension).some((allowed: string) => allowed !== '' && allowed === extension);
}

export function isAiModelUploadActive(upload: AiModelUploadItem): boolean {
  return upload.status === AI_MODEL_UPLOAD_STATUS.queued || upload.status === AI_MODEL_UPLOAD_STATUS.uploading;
}

/** Derives what an upload surface should show from its staged files and the uploads of its current session. */
export function getAiModelUploadPhase(stagedFileCount: number, hasSession: boolean, sessionUploads: AiModelUploadItem[]): AiModelUploadPhase {
  if (!hasSession) {
    return stagedFileCount > 0 ? AI_MODEL_UPLOAD_PHASE.staging : AI_MODEL_UPLOAD_PHASE.empty;
  }
  if (sessionUploads.some(isAiModelUploadActive)) {
    return AI_MODEL_UPLOAD_PHASE.uploading;
  }
  if (sessionUploads.some((upload: AiModelUploadItem) => upload.status === AI_MODEL_UPLOAD_STATUS.failed)) {
    return AI_MODEL_UPLOAD_PHASE.failed;
  }
  return AI_MODEL_UPLOAD_PHASE.completed;
}

/**
 * The uploads that are still going: every file of a batch that has at least one file queued or
 * uploading. Files of such a batch that are already done are included, so the batch reads as a whole.
 */
export function getInProgressAiModelUploads(uploads: AiModelUploadItem[], excludeBatchId?: string | null): AiModelUploadItem[] {
  const activeBatchIds = new Set<string>(uploads.filter(isAiModelUploadActive).map((upload: AiModelUploadItem) => upload.batchId));
  return uploads.filter((upload: AiModelUploadItem) => activeBatchIds.has(upload.batchId) && upload.batchId !== excludeBatchId);
}

export function clampProgress(progress: number): number {
  if (Number.isNaN(progress)) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round(progress)));
}

export interface AiModelUploadSummary {
  /** Number of files. */
  total: number;
  /** Number of files that reached the server. */
  completed: number;
  /** Average progress of the files, 0 to 100. With one file this is that file's progress. */
  percent: number;
}

/** Overall progress by number of files: every file weighs the same, whatever its size. */
export function getAiModelUploadSummary(uploads: AiModelUploadItem[]): AiModelUploadSummary {
  const total: number = uploads.length;
  const completed: number = uploads.filter((upload: AiModelUploadItem) => upload.status === AI_MODEL_UPLOAD_STATUS.completed).length;
  const progressSum: number = uploads.reduce((sum: number, upload: AiModelUploadItem) => sum + upload.progress, 0);
  return { total, completed, percent: total === 0 ? 0 : clampProgress(progressSum / total) };
}

/** `45% (1/3)` */
export function formatAiModelUploadSummary(summary: AiModelUploadSummary): string {
  return `${summary.percent}% (${summary.completed}/${summary.total})`;
}

/** Chunks of at most `AI_MODEL_UPLOAD_MAX_CHUNK_BYTES`, and small enough that a small file still takes about `AI_MODEL_UPLOAD_MIN_CHUNK_COUNT` steps. */
export function getAiModelUploadChunkSize(fileSize: number): number {
  return Math.max(1, Math.min(AI_MODEL_UPLOAD_MAX_CHUNK_BYTES, Math.ceil(fileSize / AI_MODEL_UPLOAD_MIN_CHUNK_COUNT)));
}
