'use client';

import { cn } from '@/lib/utils';

import { useHasActiveFileUploads } from './file-upload.store';

interface FileUploadActiveIndicatorProps {
  className?: string;
}

/** A small pulsing dot that is only rendered while at least one file is uploading. */
export default function FileUploadActiveIndicator({ className }: FileUploadActiveIndicatorProps) {
  const hasActiveUploads: boolean = useHasActiveFileUploads();

  if (!hasActiveUploads) {
    return null;
  }
  return (
    <span
      role="status"
      className={ cn('absolute -top-1 -right-1 size-2.5 animate-pulse rounded-full bg-yellow-500 ring-2 ring-background dark:bg-yellow-400', className) }
    >
      <span className="sr-only">Uploads in progress</span>
    </span>
  );
}
