'use client';

import { useMemo } from 'react';

import { getAiModelUploadPhase } from '../utils/ai-model-upload.utils';
import { AI_MODEL_UPLOAD_PHASE } from '../constants/ai-model-upload.constants';
import { useAiModelUploadMutation } from './useAiModelUploadMutation';
import { useAiModelUploads, useAiModelUploadActions, useAiModelUploadStagedFiles, useAiModelUploadSessionBatchId } from '../store/ai-model-upload.store';

import type { AiModelUploadFormValues } from '../schemas/ai-model-upload.schema';
import type { AiModelUploadItem, AiModelUploadPhase, AiModelUploadVariables } from '../models/ai-model-upload.models';

interface UseAiModelUploadResult {
  phase: AiModelUploadPhase;
  stagedFiles: File[];
  /** The batch started by the last press of Upload in the dialog, null while nothing was started. */
  sessionBatchId: string | null;
  /** The uploads started by the last press of Upload in the dialog. */
  sessionUploads: AiModelUploadItem[];
  /** True once Upload was pressed, whether the upload is still running or already done. */
  hasStarted: boolean;
  isUploading: boolean;
  setStagedFiles: (files: File[]) => void;
  /** Sends every staged file with this name and model key, one upload (and one mutation) per file. */
  startUpload: (values: AiModelUploadFormValues) => void;
  /**
   * Call when the dialog opens. If Upload was pressed the last time it starts empty again, a file that
   * was only staged is kept. Running uploads keep going either way.
   */
  endSession: () => void;
}

/** Everything the upload dialog needs to walk through the upload phases. */
export function useAiModelUpload(): UseAiModelUploadResult {
  const stagedFiles = useAiModelUploadStagedFiles();
  const uploads = useAiModelUploads();
  const sessionBatchId = useAiModelUploadSessionBatchId();
  const { setStagedFiles, startSession, endSession } = useAiModelUploadActions();
  const { mutate } = useAiModelUploadMutation();

  const sessionUploads: AiModelUploadItem[] = useMemo(
    () => {
      return sessionBatchId === null ? [] : uploads.filter((upload: AiModelUploadItem) => {
        return upload.batchId === sessionBatchId;
      });
    },
    [uploads, sessionBatchId],
  );
  const phase: AiModelUploadPhase = getAiModelUploadPhase(stagedFiles.length, sessionBatchId !== null, sessionUploads);

  return {
    phase,
    stagedFiles,
    sessionBatchId,
    sessionUploads,
    hasStarted: sessionBatchId !== null,
    isUploading: phase === AI_MODEL_UPLOAD_PHASE.uploading,
    setStagedFiles,
    startUpload: (values: AiModelUploadFormValues) => {
      startSession(values).forEach((variables: AiModelUploadVariables) => {
        mutate(variables);
      });
    },
    endSession,
  };
}
