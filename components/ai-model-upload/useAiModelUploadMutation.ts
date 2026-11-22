'use client';

import { useMutation } from '@tanstack/react-query';

import { clampProgress } from './ai-model-upload.utils';
import { useAiModelUploadStore } from './ai-model-upload.store';
import { uploadAiModelFile } from './ai-model-upload.uploader';
import { AI_MODEL_UPLOAD_STATUS, AI_MODEL_UPLOAD_MUTATION_KEY } from './ai-model-upload.constants';

import type { AiModelUploadItem, AiModelUploadVariables } from './ai-model-upload.models';

/** Writes to the store from outside of React: these callbacks keep running after the dialog unmounted. */
function patchUpload(id: string, patch: Partial<AiModelUploadItem>): void {
  useAiModelUploadStore.getState().actions.patchUpload(id, patch);
}

/**
 * One TanStack Query mutation per file. `mutate` can be called again while earlier uploads are still
 * running: every call is its own mutation, so uploads run in parallel. The callbacks are given here and
 * not to `mutate`, because TanStack Query only skips `mutate`'s own callbacks when the component
 * unmounts, and the dialog that starts an upload can close long before it ends. Running uploads show
 * up in the React Query devtools under `AI_MODEL_UPLOAD_MUTATION_KEY`.
 */
export function useAiModelUploadMutation() {
  return useMutation<string, Error, AiModelUploadVariables>({
    mutationKey: AI_MODEL_UPLOAD_MUTATION_KEY,
    mutationFn: ({ uploadId, file, name, modelKey }: AiModelUploadVariables) => {
      return uploadAiModelFile({
        file,
        name,
        modelKey,
        onArtifactId: (artifactId: string) => {
          patchUpload(uploadId, { artifactId });
        },
        onProgress: (progress: number, uploadedBytes: number) => {
          useAiModelUploadStore.getState().actions.recordProgress(uploadId, uploadedBytes, clampProgress(progress));
        },
      });
    },
    // the uploader already retries each chunk, a retry of the whole upload is the user's call (the Retry button)
    retry: false,
    onMutate: ({ uploadId }: AiModelUploadVariables) => {
      patchUpload(uploadId, { status: AI_MODEL_UPLOAD_STATUS.uploading });
    },
    onSuccess: (artifactId: string, { uploadId }: AiModelUploadVariables) => {
      useAiModelUploadStore.getState().actions.releaseUploadFile(uploadId);
      patchUpload(uploadId, { status: AI_MODEL_UPLOAD_STATUS.completed, progress: 100, artifactId });
    },
    onError: (error: Error, { uploadId }: AiModelUploadVariables) => {
      patchUpload(uploadId, { status: AI_MODEL_UPLOAD_STATUS.failed, error: error.message || 'Upload failed' });
    },
  });
}
