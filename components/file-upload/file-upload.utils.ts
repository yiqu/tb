import { FILE_UPLOAD_PHASE, FILE_UPLOAD_STATUS } from './file-upload.constants';

import type { FileUploadItem, FileUploadPhase } from './file-upload.models';

/** `'.TXT'`, `'txt'` and `' .txt '` all become `'.txt'`. */
export function normalizeFileExtension(extension: string): string {
  const trimmed: string = extension.trim().toLowerCase();
  if (trimmed === '') {
    return '';
  }
  return trimmed.startsWith('.') ? trimmed : `.${trimmed}`;
}

/** The extension of a file name including the dot and lower cased, `''` when there is none. */
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
  return allowedExtensions.some((allowed: string) => normalizeFileExtension(allowed) === extension);
}

export function isFileUploadActive(upload: FileUploadItem): boolean {
  return upload.status === FILE_UPLOAD_STATUS.queued || upload.status === FILE_UPLOAD_STATUS.uploading;
}

/** Derives what an upload surface should show from its staged files and the uploads of its current session. */
export function getFileUploadPhase(stagedFileCount: number, hasSession: boolean, sessionUploads: FileUploadItem[]): FileUploadPhase {
  if (!hasSession) {
    return stagedFileCount > 0 ? FILE_UPLOAD_PHASE.staging : FILE_UPLOAD_PHASE.empty;
  }
  if (sessionUploads.some(isFileUploadActive)) {
    return FILE_UPLOAD_PHASE.uploading;
  }
  if (sessionUploads.some((upload: FileUploadItem) => upload.status === FILE_UPLOAD_STATUS.failed)) {
    return FILE_UPLOAD_PHASE.failed;
  }
  return FILE_UPLOAD_PHASE.completed;
}

export function clampProgress(progress: number): number {
  if (Number.isNaN(progress)) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round(progress)));
}
