import { cn } from '@/lib/utils';
import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

import AiModelUploadProgressBar from './AiModelUploadProgressBar';
import AiModelUploadTimeRemaining from './AiModelUploadTimeRemaining';
import { AI_MODEL_UPLOAD_STATUS } from '../constants/ai-model-upload.constants';

import type { AiModelUploadItem } from '../models/ai-model-upload.models';

interface AiModelUploadStatusRowProps {
  upload: AiModelUploadItem;
  className?: string;
}

/** One upload: the name it is saved under, its model key and file, a progress bar, the percentage and, while it runs, the time left. Display only. */
export default function AiModelUploadStatusRow({ upload, className }: AiModelUploadStatusRowProps) {
  const isFailed: boolean = upload.status === AI_MODEL_UPLOAD_STATUS.failed;
  const isUploading: boolean = upload.status === AI_MODEL_UPLOAD_STATUS.uploading;

  return (
    <ColumnStack className={ cn('w-full gap-y-1', className) }>
      <Typography variant="body0" className="truncate" title={ upload.name }>
        { upload.name }
      </Typography>
      <Typography variant="caption0" className="truncate" title={ `${upload.modelKey} · ${upload.fileName}` }>
        { upload.modelKey } · { upload.fileName }
      </Typography>
      <RowStack className="items-center gap-x-2">
        <AiModelUploadProgressBar progress={ upload.progress } isFailed={ isFailed } label={ `${upload.name} upload progress` } />
        <Typography variant="body0" className={ cn('w-10 shrink-0 text-right tabular-nums', { 'text-destructive': isFailed }) }>
          { isFailed ? 'Failed' : `${upload.progress}%` }
        </Typography>
      </RowStack>
      { isUploading ?
        <AiModelUploadTimeRemaining upload={ upload } />
      : null }
      { isFailed && upload.error ?
        <Typography variant="caption0" className="truncate text-destructive dark:text-destructive" title={ upload.error }>
          { upload.error }
        </Typography>
      : null }
    </ColumnStack>
  );
}
