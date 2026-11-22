'use client';

import { useMutation } from '@tanstack/react-query';

import { cancelPwsModelUpload } from '../api/pws-model-upload.api';
import { PWS_MODEL_UPLOAD_CANCEL_MUTATION_KEY } from '../constants/pws-model-upload.constants';

interface PwsModelUploadCancelVariables {
  artifactId: string;
  /** Size of the whole file in bytes, the `Upload-Length` header. */
  uploadLength: number;
}

/**
 * `DELETE`s an upload on the server, e.g. a failed one the user cleared away. Best effort: there is
 * nothing left in the UI to report a failure to, an upload that is never finished is the server's to expire.
 */
export function usePwsModelUploadCancelMutation() {
  return useMutation<void, Error, PwsModelUploadCancelVariables>({
    mutationKey: PWS_MODEL_UPLOAD_CANCEL_MUTATION_KEY,
    mutationFn: (variables: PwsModelUploadCancelVariables) => {
      return cancelPwsModelUpload(variables);
    },
    retry: false,
  });
}
