'use client';

import { RotateCw } from 'lucide-react';
import { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';

import { AI_MODEL_UPLOAD_STATUS } from './ai-model-upload.constants';
import { useAiModelUploadMutation } from './useAiModelUploadMutation';
import { useAiModelUploads, useAiModelUploadActions, useAiModelUploadSessionBatchId } from './ai-model-upload.store';

import type { AiModelUploadItem, AiModelUploadVariables } from './ai-model-upload.models';

interface AiModelUploadRetryButtonProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  /**
   * Which failed files to send again: `session` (default) is the batch the dialog is following, `all`
   * is every failed file in the app (e.g. for a button in the notifications popover).
   */
  scope?: 'session' | 'all';
}

/**
 * Sends the failed files again, each as a new upload. Self contained: it reads the upload store and
 * starts the upload mutations itself, and renders nothing while there is no failed file in its scope.
 * Remove the element to take the feature away.
 */
export default function AiModelUploadRetryButton({ scope = 'session', children, ...props }: AiModelUploadRetryButtonProps) {
  const uploads = useAiModelUploads();
  const sessionBatchId = useAiModelUploadSessionBatchId();
  const { prepareRetry } = useAiModelUploadActions();
  const { mutate } = useAiModelUploadMutation();

  const batchId: string | undefined = scope === 'session' ? (sessionBatchId ?? undefined) : undefined;
  const failedCount: number = uploads.filter(
    (upload: AiModelUploadItem) => upload.status === AI_MODEL_UPLOAD_STATUS.failed && (batchId === undefined || upload.batchId === batchId),
  ).length;

  if (failedCount === 0 || (scope === 'session' && sessionBatchId === null)) {
    return null;
  }

  const handleOnRetry = () => {
    prepareRetry(batchId).forEach((variables: AiModelUploadVariables) => mutate(variables));
  };

  return (
    <Button type="button" variant="outline" onClick={ handleOnRetry } { ...props }>
      <RotateCw />
      { children ?? (failedCount === 1 ? 'Retry' : `Retry ${failedCount} failed files`) }
    </Button>
  );
}
