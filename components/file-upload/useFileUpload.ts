'use client';

import { useMemo } from 'react';

import { getFileUploadPhase } from './file-upload.utils';
import { FILE_UPLOAD_PHASE } from './file-upload.constants';
import { useFileUploads, useStagedFiles, useFileUploadActions, useFileUploadSessionBatchId } from './file-upload.store';

import type { FileUploadItem, FileUploadPhase, FileUploadMetadata, FileUploadServerConfig } from './file-upload.models';

interface UseFileUploadResult {
  phase: FileUploadPhase;
  stagedFiles: File[];
  /** The batch started by the last press of Upload on this surface, null while nothing was started. */
  sessionBatchId: string | null;
  /** The uploads started by the last press of Upload on this surface. */
  sessionUploads: FileUploadItem[];
  /** True once Upload was pressed, whether the uploads are still running or already done. */
  hasStarted: boolean;
  isUploading: boolean;
  setStagedFiles: (files: File[]) => void;
  startUpload: (metadata?: FileUploadMetadata) => void;
  /**
   * Call when the upload surface opens. If Upload was pressed the last time it starts empty again,
   * files that were only staged are kept. Running uploads keep going either way.
   */
  endSession: () => void;
}

/** Everything an upload surface (a dialog, a page section) needs to walk through the upload phases. */
export function useFileUpload(config: FileUploadServerConfig): UseFileUploadResult {
  const stagedFiles = useStagedFiles();
  const uploads = useFileUploads();
  const sessionBatchId = useFileUploadSessionBatchId();
  const { setStagedFiles, startUpload, endSession } = useFileUploadActions();

  const sessionUploads: FileUploadItem[] = useMemo(
    () => (sessionBatchId === null ? [] : uploads.filter((upload: FileUploadItem) => upload.batchId === sessionBatchId)),
    [uploads, sessionBatchId],
  );
  const phase: FileUploadPhase = getFileUploadPhase(stagedFiles.length, sessionBatchId !== null, sessionUploads);

  return {
    phase,
    stagedFiles,
    sessionBatchId,
    sessionUploads,
    hasStarted: sessionBatchId !== null,
    isUploading: phase === FILE_UPLOAD_PHASE.uploading,
    setStagedFiles,
    startUpload: (metadata?: FileUploadMetadata) => startUpload(config, metadata),
    endSession,
  };
}
