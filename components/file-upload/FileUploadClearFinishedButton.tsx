'use client';

import { Button } from '@/components/ui/button';

import { getInProgressFileUploads } from './file-upload.utils';
import { useFileUploads, useFileUploadActions } from './file-upload.store';

/** Removes the batches that finished (completed or failed) from the status list. Hidden while there is nothing to clear. */
export default function FileUploadClearFinishedButton() {
  const uploads = useFileUploads();
  const { clearFinishedUploads } = useFileUploadActions();
  // a batch with a file still running is kept whole, so only the uploads outside of those can be cleared
  const hasFinishedUploads: boolean = getInProgressFileUploads(uploads).length < uploads.length;

  if (!hasFinishedUploads) {
    return null;
  }
  return (
    <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={ clearFinishedUploads }>
      Clear finished
    </Button>
  );
}
