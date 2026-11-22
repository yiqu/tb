'use client';

import { Button } from '@/components/ui/button';

import { getInProgressAiModelUploads } from '../utils/ai-model-upload.utils';
import { AI_MODEL_UPLOAD_CLEAR_FINISHED_LABEL } from '../constants/ai-model-upload.constants';
import { useAiModelUploads, useAiModelUploadActions } from '../store/ai-model-upload.store';
import { useAiModelUploadCancelMutation } from '../hooks/useAiModelUploadCancelMutation';

import type { AiModelUploadItem } from '../models/ai-model-upload.models';

/**
 * Removes the batches that finished (completed or failed) from the status list, and stops the cleared
 * failed uploads on the server (nothing will finish them any more). Hidden while there is
 * nothing to clear.
 */
export default function AiModelUploadClearFinishedButton() {
  const uploads = useAiModelUploads();
  const { clearFinishedUploads } = useAiModelUploadActions();
  const { mutate: cancelUpload } = useAiModelUploadCancelMutation();
  // a batch with a file still running is kept whole, so only the uploads outside of those can be cleared
  const hasFinishedUploads: boolean = getInProgressAiModelUploads(uploads).length < uploads.length;

  if (!hasFinishedUploads) {
    return null;
  }

  const handleOnClear = () => {
    clearFinishedUploads().forEach((upload: AiModelUploadItem) => {
      if (upload.artifactId !== null) {
        cancelUpload({ artifactId: upload.artifactId, uploadLength: upload.size });
      }
    });
  };

  return (
    <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={ handleOnClear }>
      { AI_MODEL_UPLOAD_CLEAR_FINISHED_LABEL }
    </Button>
  );
}
