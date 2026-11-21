'use client';

import { cn } from '@/lib/utils';

import { useAiModelUploads } from './ai-model-upload.store';
import AiModelUploadStatusList from './AiModelUploadStatusList';
import AiModelUploadStatusEmpty from './AiModelUploadStatusEmpty';

interface AiModelUploadStatusOverviewProps {
  className?: string;
}

/**
 * The progress of every upload in the app, whichever surface started it. Reads the upload store,
 * so it can be dropped anywhere (e.g. the notifications popover) with no props.
 */
export default function AiModelUploadStatusOverview({ className }: AiModelUploadStatusOverviewProps) {
  const uploads = useAiModelUploads();

  if (uploads.length === 0) {
    return <AiModelUploadStatusEmpty className={ className } />;
  }
  return <AiModelUploadStatusList uploads={ uploads } className={ cn('max-h-72 overflow-y-auto pr-1', className) } />;
}
