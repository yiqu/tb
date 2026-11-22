'use client';

import { cn } from '@/lib/utils';

import { usePwsModelUploads } from '../store/pws-model-upload.store';
import PwsModelUploadStatusList from './PwsModelUploadStatusList';
import PwsModelUploadStatusEmpty from './PwsModelUploadStatusEmpty';

interface PwsModelUploadStatusOverviewProps {
  className?: string;
}

/**
 * The progress of every upload in the app, whichever surface started it. Reads the upload store,
 * so it can be dropped anywhere (e.g. the notifications popover) with no props.
 */
export default function PwsModelUploadStatusOverview({ className }: PwsModelUploadStatusOverviewProps) {
  const uploads = usePwsModelUploads();

  if (uploads.length === 0) {
    return <PwsModelUploadStatusEmpty className={ className } />;
  }
  return <PwsModelUploadStatusList uploads={ uploads } className={ cn('max-h-72 overflow-y-auto pr-1', className) } />;
}
