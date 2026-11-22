'use client';

import { useMutation } from '@tanstack/react-query';

import { cancelAiModelUpload } from '../api/ai-model-upload.api';
import { AI_MODEL_UPLOAD_CANCEL_MUTATION_KEY } from '../constants/ai-model-upload.constants';

interface AiModelUploadCancelVariables {
  artifactId: string;
  /** Size of the whole file in bytes, the `Upload-Length` header. */
  uploadLength: number;
}

/**
 * `DELETE`s an upload on the server, e.g. a failed one the user cleared away. Best effort: there is
 * nothing left in the UI to report a failure to, an upload that is never finished is the server's to expire.
 */
export function useAiModelUploadCancelMutation() {
  return useMutation<void, Error, AiModelUploadCancelVariables>({
    mutationKey: AI_MODEL_UPLOAD_CANCEL_MUTATION_KEY,
    mutationFn: (variables: AiModelUploadCancelVariables) => {
      return cancelAiModelUpload(variables);
    },
    retry: false,
  });
}
