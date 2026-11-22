'use client';

import { cn } from '@/lib/utils';

import { useHasActivePwsModelUploads } from '../store/pws-model-upload.store';
import { PWS_MODEL_UPLOAD_ACTIVE_INDICATOR_LABEL } from '../constants/pws-model-upload.constants';

interface PwsModelUploadActiveIndicatorProps {
  className?: string;
}

/** A small pulsing dot that is only rendered while at least one file is uploading. */
export default function PwsModelUploadActiveIndicator({ className }: PwsModelUploadActiveIndicatorProps) {
  const hasActiveUploads: boolean = useHasActivePwsModelUploads();

  if (!hasActiveUploads) {
    return null;
  }
  return (
    <span
      role="status"
      className={ cn('absolute -top-1 -right-1 size-2.5 animate-pulse rounded-full bg-yellow-500 ring-2 ring-background dark:bg-yellow-400', className) }
    >
      <span className="sr-only">{ PWS_MODEL_UPLOAD_ACTIVE_INDICATOR_LABEL }</span>
    </span>
  );
}
