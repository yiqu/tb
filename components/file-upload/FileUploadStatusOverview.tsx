'use client';

import { cn } from '@/lib/utils';

import { useFileUploads } from './file-upload.store';
import FileUploadStatusList from './FileUploadStatusList';
import FileUploadStatusEmpty from './FileUploadStatusEmpty';

interface FileUploadStatusOverviewProps {
  className?: string;
}

/**
 * The progress of every upload in the app, whichever surface started it. Reads the upload store,
 * so it can be dropped anywhere (e.g. the notifications popover) with no props.
 */
export default function FileUploadStatusOverview({ className }: FileUploadStatusOverviewProps) {
  const uploads = useFileUploads();

  if (uploads.length === 0) {
    return <FileUploadStatusEmpty />;
  }
  return <FileUploadStatusList uploads={ uploads } className={ cn('max-h-72 overflow-y-auto pr-1', className) } />;
}
