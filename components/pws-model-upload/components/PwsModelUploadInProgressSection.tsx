'use client';

import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

import { usePwsModelUploads } from '../store/pws-model-upload.store';
import PwsModelUploadStatusList from './PwsModelUploadStatusList';
import { getInProgressPwsModelUploads } from '../utils/pws-model-upload.utils';
import { PWS_MODEL_UPLOAD_IN_PROGRESS_SECTION_TITLE } from '../constants/pws-model-upload.constants';

interface PwsModelUploadInProgressSectionProps {
  title?: string;
  /** A batch to leave out, e.g. the one the surface already shows as its own session. */
  excludeBatchId?: string | null;
  /** Draws a divider under the section, to set it apart from what follows. */
  withDivider?: boolean;
  className?: string;
}

/**
 * The uploads that are still running, wherever they were started. Reads the upload store and
 * renders the same rows as the notifications popover (<PwsModelUploadStatusList>). Renders nothing
 * while no upload is in progress, so it can sit at the top of an upload surface permanently.
 */
export default function PwsModelUploadInProgressSection({
  title = PWS_MODEL_UPLOAD_IN_PROGRESS_SECTION_TITLE,
  excludeBatchId,
  withDivider = false,
  className,
}: PwsModelUploadInProgressSectionProps) {
  const uploads = usePwsModelUploads();
  const inProgressUploads = useMemo(() => {
    return getInProgressPwsModelUploads(uploads, excludeBatchId);
  }, [uploads, excludeBatchId]);

  if (inProgressUploads.length === 0) {
    return null;
  }
  return (
    <ColumnStack className={ cn('w-full gap-y-4', className) }>
      <ColumnStack className="gap-y-3">
        <Typography variant="label1" as="h3" className="font-medium">
          { title }
        </Typography>
        <PwsModelUploadStatusList uploads={ inProgressUploads } className="max-h-48 overflow-y-auto pr-1" />
      </ColumnStack>
      { withDivider ?
        <Separator />
      : null }
    </ColumnStack>
  );
}
