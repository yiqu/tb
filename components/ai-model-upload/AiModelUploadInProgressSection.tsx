'use client';

import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

import { useAiModelUploads } from './ai-model-upload.store';
import AiModelUploadStatusList from './AiModelUploadStatusList';
import { getInProgressAiModelUploads } from './ai-model-upload.utils';
import { AI_MODEL_UPLOAD_IN_PROGRESS_SECTION_TITLE } from './ai-model-upload.constants';

interface AiModelUploadInProgressSectionProps {
  title?: string;
  /** A batch to leave out, e.g. the one the surface already shows as its own session. */
  excludeBatchId?: string | null;
  /** Draws a divider under the section, to set it apart from what follows. */
  withDivider?: boolean;
  className?: string;
}

/**
 * The uploads that are still running, wherever they were started. Reads the upload store and
 * renders the same rows as the notifications popover (<AiModelUploadStatusList>). Renders nothing
 * while no upload is in progress, so it can sit at the top of an upload surface permanently.
 */
export default function AiModelUploadInProgressSection({
  title = AI_MODEL_UPLOAD_IN_PROGRESS_SECTION_TITLE,
  excludeBatchId,
  withDivider = false,
  className,
}: AiModelUploadInProgressSectionProps) {
  const uploads = useAiModelUploads();
  const inProgressUploads = useMemo(() => {
    return getInProgressAiModelUploads(uploads, excludeBatchId);
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
        <AiModelUploadStatusList uploads={ inProgressUploads } className="max-h-48 overflow-y-auto pr-1" />
      </ColumnStack>
      { withDivider ?
        <Separator />
      : null }
    </ColumnStack>
  );
}
