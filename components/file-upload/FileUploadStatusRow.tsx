import { cn } from '@/lib/utils';
import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

import FileUploadProgressBar from './FileUploadProgressBar';
import { FILE_UPLOAD_STATUS } from './file-upload.constants';

import type { FileUploadItem } from './file-upload.models';

interface FileUploadStatusRowProps {
  upload: FileUploadItem;
  className?: string;
}

/** One uploading file: its name, a progress bar and the percentage to the right of the bar. Display only. */
export default function FileUploadStatusRow({ upload, className }: FileUploadStatusRowProps) {
  const isFailed: boolean = upload.status === FILE_UPLOAD_STATUS.failed;

  return (
    <ColumnStack className={ cn('w-full gap-y-1', className) }>
      <Typography variant="body0" className="truncate" title={ upload.name }>
        { upload.name }
      </Typography>
      <RowStack className="items-center gap-x-2">
        <FileUploadProgressBar progress={ upload.progress } isFailed={ isFailed } label={ `Upload progress of ${upload.name}` } />
        <Typography variant="body0" className={ cn('w-10 shrink-0 text-right tabular-nums', { 'text-destructive': isFailed }) }>
          { isFailed ? 'Failed' : `${upload.progress}%` }
        </Typography>
      </RowStack>
      { isFailed && upload.error ?
        <Typography variant="caption0" className="truncate text-destructive dark:text-destructive" title={ upload.error }>
          { upload.error }
        </Typography>
      : null }
    </ColumnStack>
  );
}
