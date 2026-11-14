'use client';

import { Button } from '@/components/ui/button';

import { isFileUploadActive } from './file-upload.utils';
import { useFileUploads, useFileUploadActions } from './file-upload.store';

import type { FileUploadItem } from './file-upload.models';

/** Removes the completed and failed uploads from the status list. Hidden while there is nothing to clear. */
export default function FileUploadClearFinishedButton() {
  const uploads = useFileUploads();
  const { clearFinishedUploads } = useFileUploadActions();
  const hasFinishedUploads: boolean = uploads.some((upload: FileUploadItem) => !isFileUploadActive(upload));

  if (!hasFinishedUploads) {
    return null;
  }
  return (
    <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={ clearFinishedUploads }>
      Clear finished
    </Button>
  );
}
