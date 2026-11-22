'use client';

import { cn } from '@/lib/utils';

import { useHasActiveAiModelUploads } from '../store/ai-model-upload.store';
import { AI_MODEL_UPLOAD_ACTIVE_INDICATOR_LABEL } from '../constants/ai-model-upload.constants';

interface AiModelUploadActiveIndicatorProps {
  className?: string;
}

/** A small pulsing dot that is only rendered while at least one file is uploading. */
export default function AiModelUploadActiveIndicator({ className }: AiModelUploadActiveIndicatorProps) {
  const hasActiveUploads: boolean = useHasActiveAiModelUploads();

  if (!hasActiveUploads) {
    return null;
  }
  return (
    <span
      role="status"
      className={ cn('absolute -top-1 -right-1 size-2.5 animate-pulse rounded-full bg-yellow-500 ring-2 ring-background dark:bg-yellow-400', className) }
    >
      <span className="sr-only">{ AI_MODEL_UPLOAD_ACTIVE_INDICATOR_LABEL }</span>
    </span>
  );
}
