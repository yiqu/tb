'use client';

import { useMemo } from 'react';

import { getPwsModelUploadPhase } from '../utils/pws-model-upload.utils';
import { PWS_MODEL_UPLOAD_PHASE } from '../constants/pws-model-upload.constants';
import { usePwsModelUploadMutation } from './usePwsModelUploadMutation';
import { usePwsModelUploads, usePwsModelUploadActions, usePwsModelUploadStagedFiles, usePwsModelUploadSessionBatchId } from '../store/pws-model-upload.store';

import type { PwsModelUploadFormValues } from '../schemas/pws-model-upload.schema';
import type { PwsModelUploadItem, PwsModelUploadPhase, PwsModelUploadVariables } from '../models/pws-model-upload.models';

interface UsePwsModelUploadResult {
  phase: PwsModelUploadPhase;
  stagedFiles: File[];
  /** The batch started by the last press of Upload in the dialog, null while nothing was started. */
  sessionBatchId: string | null;
  /** The uploads started by the last press of Upload in the dialog. */
  sessionUploads: PwsModelUploadItem[];
  /** True once Upload was pressed, whether the upload is still running or already done. */
  hasStarted: boolean;
  isUploading: boolean;
  setStagedFiles: (files: File[]) => void;
  /** Sends every staged file with this name and model key, one upload (and one mutation) per file. */
  startUpload: (values: PwsModelUploadFormValues) => void;
  /**
   * Call when the dialog opens. If Upload was pressed the last time it starts empty again, a file that
   * was only staged is kept. Running uploads keep going either way.
   */
  endSession: () => void;
}

/** Everything the upload dialog needs to walk through the upload phases. */
export function usePwsModelUpload(): UsePwsModelUploadResult {
  const stagedFiles = usePwsModelUploadStagedFiles();
  const uploads = usePwsModelUploads();
  const sessionBatchId = usePwsModelUploadSessionBatchId();
  const { setStagedFiles, startSession, endSession } = usePwsModelUploadActions();
  const { mutate } = usePwsModelUploadMutation();

  const sessionUploads: PwsModelUploadItem[] = useMemo(
    () => {
      return sessionBatchId === null ? [] : uploads.filter((upload: PwsModelUploadItem) => {
        return upload.batchId === sessionBatchId;
      });
    },
    [uploads, sessionBatchId],
  );
  const phase: PwsModelUploadPhase = getPwsModelUploadPhase(stagedFiles.length, sessionBatchId !== null, sessionUploads);

  return {
    phase,
    stagedFiles,
    sessionBatchId,
    sessionUploads,
    hasStarted: sessionBatchId !== null,
    isUploading: phase === PWS_MODEL_UPLOAD_PHASE.uploading,
    setStagedFiles,
    startUpload: (values: PwsModelUploadFormValues) => {
      startSession(values).forEach((variables: PwsModelUploadVariables) => {
        mutate(variables);
      });
    },
    endSession,
  };
}
