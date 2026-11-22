'use client';

import { useMutation } from '@tanstack/react-query';

import { clampProgress } from '../utils/pws-model-upload.utils';
import { usePwsModelUploadStore } from '../store/pws-model-upload.store';
import { uploadPwsModelFile } from '../api/pws-model-upload.uploader';
import { PWS_MODEL_UPLOAD_STATUS, PWS_MODEL_UPLOAD_MUTATION_KEY } from '../constants/pws-model-upload.constants';

import type { PwsModelUploadItem, PwsModelUploadVariables } from '../models/pws-model-upload.models';

/** Writes to the store from outside of React: these callbacks keep running after the dialog unmounted. */
function patchUpload(id: string, patch: Partial<PwsModelUploadItem>): void {
  usePwsModelUploadStore.getState().actions.patchUpload(id, patch);
}

/**
 * One TanStack Query mutation per file. `mutate` can be called again while earlier uploads are still
 * running: every call is its own mutation, so uploads run in parallel. The callbacks are given here and
 * not to `mutate`, because TanStack Query only skips `mutate`'s own callbacks when the component
 * unmounts, and the dialog that starts an upload can close long before it ends. Running uploads show
 * up in the React Query devtools under `PWS_MODEL_UPLOAD_MUTATION_KEY`.
 */
export function usePwsModelUploadMutation() {
  return useMutation<string, Error, PwsModelUploadVariables>({
    mutationKey: PWS_MODEL_UPLOAD_MUTATION_KEY,
    mutationFn: ({ uploadId, file, name, modelKey }: PwsModelUploadVariables) => {
      return uploadPwsModelFile({
        file,
        name,
        modelKey,
        onArtifactId: (artifactId: string) => {
          patchUpload(uploadId, { artifactId });
        },
        onProgress: (progress: number, uploadedBytes: number) => {
          usePwsModelUploadStore.getState().actions.recordProgress(uploadId, uploadedBytes, clampProgress(progress));
        },
      });
    },
    // the uploader already retries each chunk, a retry of the whole upload is the user's call (the Retry button)
    retry: false,
    onMutate: ({ uploadId }: PwsModelUploadVariables) => {
      patchUpload(uploadId, { status: PWS_MODEL_UPLOAD_STATUS.uploading });
    },
    onSuccess: (artifactId: string, { uploadId }: PwsModelUploadVariables) => {
      usePwsModelUploadStore.getState().actions.releaseUploadFile(uploadId);
      patchUpload(uploadId, { status: PWS_MODEL_UPLOAD_STATUS.completed, progress: 100, artifactId });
    },
    onError: (error: Error, { uploadId }: PwsModelUploadVariables) => {
      patchUpload(uploadId, { status: PWS_MODEL_UPLOAD_STATUS.failed, error: error.message || 'Upload failed' });
    },
  });
}
