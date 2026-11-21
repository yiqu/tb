'use client';

import { Button } from '@/components/ui/button';

import { getInProgressAiModelUploads } from './ai-model-upload.utils';
import { AI_MODEL_UPLOAD_CLEAR_FINISHED_LABEL } from './ai-model-upload.constants';
import { useAiModelUploads, useAiModelUploadActions } from './ai-model-upload.store';

/** Removes the batches that finished (completed or failed) from the status list. Hidden while there is nothing to clear. */
export default function AiModelUploadClearFinishedButton() {
  const uploads = useAiModelUploads();
  const { clearFinishedUploads } = useAiModelUploadActions();
  // a batch with a file still running is kept whole, so only the uploads outside of those can be cleared
  const hasFinishedUploads: boolean = getInProgressAiModelUploads(uploads).length < uploads.length;

  if (!hasFinishedUploads) {
    return null;
  }
  return (
    <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={ clearFinishedUploads }>
      { AI_MODEL_UPLOAD_CLEAR_FINISHED_LABEL }
    </Button>
  );
}
