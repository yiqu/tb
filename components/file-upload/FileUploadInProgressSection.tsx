'use client';

import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

import { useFileUploads } from './file-upload.store';
import FileUploadStatusList from './FileUploadStatusList';
import { getInProgressFileUploads } from './file-upload.utils';
import { FILE_UPLOAD_IN_PROGRESS_SECTION_TITLE } from './file-upload.constants';

interface FileUploadInProgressSectionProps {
  title?: string;
  /** A batch to leave out, e.g. the one the surface already shows as its own session. */
  excludeBatchId?: string | null;
  /** Draws a divider under the section, to set it apart from what follows. */
  withDivider?: boolean;
  className?: string;
}

/**
 * The uploads that are still running, wherever they were started. Reads the upload store and
 * renders the same rows as the notifications popover (<FileUploadStatusList>). Renders nothing
 * while no upload is in progress, so it can sit at the top of an upload surface permanently.
 */
export default function FileUploadInProgressSection({
  title = FILE_UPLOAD_IN_PROGRESS_SECTION_TITLE,
  excludeBatchId,
  withDivider = false,
  className,
}: FileUploadInProgressSectionProps) {
  const uploads = useFileUploads();
  const inProgressUploads = useMemo(() => getInProgressFileUploads(uploads, excludeBatchId), [uploads, excludeBatchId]);

  if (inProgressUploads.length === 0) {
    return null;
  }
  return (
    <ColumnStack className={ cn('w-full gap-y-4', className) }>
      <ColumnStack className="gap-y-3">
        <Typography variant="label1" as="h3" className="font-medium">
          { title }
        </Typography>
        <FileUploadStatusList uploads={ inProgressUploads } className="max-h-48 overflow-y-auto pr-1" />
      </ColumnStack>
      { withDivider ?
        <Separator />
      : null }
    </ColumnStack>
  );
}
