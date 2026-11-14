'use client';

import { RotateCw } from 'lucide-react';
import { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';

import { FILE_UPLOAD_STATUS } from './file-upload.constants';
import { useFileUploads, useFileUploadActions, useFileUploadSessionBatchId } from './file-upload.store';

import type { FileUploadItem } from './file-upload.models';

interface FileUploadRetryButtonProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  /**
   * Which failed files to send again: `session` (default) is the batch the upload surface is
   * following, `all` is every failed file in the app.
   */
  scope?: 'session' | 'all';
}

/**
 * Sends the failed files again. Self contained: it reads the upload store, and it renders nothing
 * while there is no failed file in its scope. Drop it in wherever a retry should be offered, remove
 * the element to take the feature away.
 */
export default function FileUploadRetryButton({ scope = 'session', children, ...props }: FileUploadRetryButtonProps) {
  const uploads = useFileUploads();
  const sessionBatchId = useFileUploadSessionBatchId();
  const { retryFailedUploads } = useFileUploadActions();

  const batchId: string | undefined = scope === 'session' ? (sessionBatchId ?? undefined) : undefined;
  const failedCount: number = uploads.filter(
    (upload: FileUploadItem) => upload.status === FILE_UPLOAD_STATUS.failed && (batchId === undefined || upload.batchId === batchId),
  ).length;

  if (failedCount === 0 || (scope === 'session' && sessionBatchId === null)) {
    return null;
  }
  return (
    <Button type="button" variant="outline" onClick={ () => retryFailedUploads(batchId) } { ...props }>
      <RotateCw />
      { children ?? (failedCount === 1 ? 'Retry failed file' : `Retry ${failedCount} failed files`) }
    </Button>
  );
}
