import { Duration } from 'luxon';

import {
  AI_MODEL_UPLOAD_PHASE,
  AI_MODEL_UPLOAD_STATUS,
  AI_MODEL_UPLOAD_MAX_CHUNK_BYTES,
  AI_MODEL_UPLOAD_MIN_CHUNK_COUNT,
  AI_MODEL_UPLOAD_SPEED_SMOOTHING,
  AI_MODEL_UPLOAD_TIME_REMAINING_FEW_SECONDS,
  AI_MODEL_UPLOAD_TIME_REMAINING_CALCULATING,
  AI_MODEL_UPLOAD_TIME_REMAINING_FEW_SECONDS_LABEL,
  getAiModelUploadTimeRemainingLabel,
} from './ai-model-upload.constants';

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

/**
 * The smoothed upload speed after `deltaBytes` were confirmed in `deltaMs`: an exponential moving
 * average, so one fast or slow chunk does not make the estimate jump.
 */
export function getNextBytesPerSecond(previous: number | null, deltaBytes: number, deltaMs: number): number | null {
  if (deltaBytes <= 0 || deltaMs <= 0) {
    return previous;
  }
  const sample: number = deltaBytes / (deltaMs / 1000);
  return previous === null ? sample : AI_MODEL_UPLOAD_SPEED_SMOOTHING * sample + (1 - AI_MODEL_UPLOAD_SPEED_SMOOTHING) * previous;
}

/**
 * Seconds until the upload is done at its current speed, counted down from its last progress report,
 * or null while the speed is not known yet.
 */
export function getAiModelUploadSecondsRemaining(upload: AiModelUploadItem, now: number): number | null {
  if (upload.bytesPerSecond === null || upload.bytesPerSecond <= 0 || upload.progressUpdatedAt === null) {
    return null;
  }
  const secondsAtLastReport: number = Math.max(0, upload.size - upload.uploadedBytes) / upload.bytesPerSecond;
  return Math.max(0, secondsAtLastReport - (now - upload.progressUpdatedAt) / 1000);
}

/** `Calculating time left…`, `A few seconds left`, `About 25 sec left`, `About 3 min 20 sec left`, `About 12 min left`, `About 1 hr 5 min left`. */
export function formatAiModelUploadTimeRemaining(seconds: number | null): string {
  if (seconds === null) {
    return AI_MODEL_UPLOAD_TIME_REMAINING_CALCULATING;
  }
  if (seconds < AI_MODEL_UPLOAD_TIME_REMAINING_FEW_SECONDS) {
    return AI_MODEL_UPLOAD_TIME_REMAINING_FEW_SECONDS_LABEL;
  }
  // rounded up to 5 seconds under a minute, to 10 seconds above, so the label does not flicker every second
  const step: number = seconds < 60 ? 5 : 10;
  const rounded: number = Math.ceil(seconds / step) * step;
  const { hours = 0, minutes = 0, seconds: restSeconds = 0 } = Duration.fromObject({ seconds: rounded }).shiftTo('hours', 'minutes', 'seconds').toObject();

  let duration: string;
  if (hours > 0) {
    duration = minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
  } else if (minutes >= 10) {
    duration = `${minutes} min`;
  } else if (minutes > 0) {
    duration = restSeconds > 0 ? `${minutes} min ${restSeconds} sec` : `${minutes} min`;
  } else {
    duration = `${restSeconds} sec`;
  }
  return getAiModelUploadTimeRemainingLabel(duration);
}
