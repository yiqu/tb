'use client';

import { RotateCw } from 'lucide-react';
import { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';

import { PWS_MODEL_UPLOAD_STATUS } from '../constants/pws-model-upload.constants';
import { usePwsModelUploadMutation } from '../hooks/usePwsModelUploadMutation';
import { usePwsModelUploadCancelMutation } from '../hooks/usePwsModelUploadCancelMutation';
import { usePwsModelUploads, usePwsModelUploadActions, usePwsModelUploadSessionBatchId } from '../store/pws-model-upload.store';

import type { PwsModelUploadItem, PwsModelUploadVariables } from '../models/pws-model-upload.models';

interface PwsModelUploadRetryButtonProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  /**
   * Which failed files to send again: `session` (default) is the batch the dialog is following, `all`
   * is every failed file in the app (e.g. for a button in the notifications popover).
   */
  scope?: 'session' | 'all';
}

/**
 * Sends the failed files again, from the start: a new `POST`, then every chunk. The failed attempt is
 * `DELETE`d on the server first (best effort). Self contained: it reads the upload store and starts the upload
 * mutations itself, and renders nothing while there is no failed file in its scope.
 * Remove the element to take the feature away.
 */
export default function PwsModelUploadRetryButton({ scope = 'session', children, ...props }: PwsModelUploadRetryButtonProps) {
  const uploads = usePwsModelUploads();
  const sessionBatchId = usePwsModelUploadSessionBatchId();
  const { prepareRetry } = usePwsModelUploadActions();
  const { mutate } = usePwsModelUploadMutation();
  const { mutate: cancelUpload } = usePwsModelUploadCancelMutation();

  const batchId: string | undefined = scope === 'session' ? (sessionBatchId ?? undefined) : undefined;
  const failedCount: number = uploads.filter(
    (upload: PwsModelUploadItem) => {
      return upload.status === PWS_MODEL_UPLOAD_STATUS.failed && (batchId === undefined || upload.batchId === batchId);
    },
  ).length;

  if (failedCount === 0 || (scope === 'session' && sessionBatchId === null)) {
    return null;
  }

  const handleOnRetry = () => {
    const { uploads: retriedUploads, abandonedUploads } = prepareRetry(batchId);
    abandonedUploads.forEach((upload: PwsModelUploadItem) => {
      if (upload.artifactId !== null) {
        cancelUpload({ artifactId: upload.artifactId, uploadLength: upload.size });
      }
    });
    retriedUploads.forEach((variables: PwsModelUploadVariables) => {
      mutate(variables);
    });
  };

  return (
    <Button type="button" variant="outline" onClick={ handleOnRetry } { ...props }>
      <RotateCw />
      { children ?? (failedCount === 1 ? 'Retry' : `Retry ${failedCount} failed files`) }
    </Button>
  );
}
