import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

import { clampProgress } from './file-upload.utils';
import { FILE_UPLOAD_PROGRESS_COLOR_THRESHOLD } from './file-upload.constants';

interface FileUploadProgressBarProps {
  /** 0 to 100. */
  progress: number;
  isFailed?: boolean;
  className?: string;
}

/** Horizontal progress bar: yellow below 70%, dark green from 70% on, red when the upload failed. */
export default function FileUploadProgressBar({ progress, isFailed = false, className }: FileUploadProgressBarProps) {
  const value: number = clampProgress(progress);
  const isAlmostDone: boolean = value >= FILE_UPLOAD_PROGRESS_COLOR_THRESHOLD;

  return (
    <Progress
      value={ value }
      className={ cn(
        'bg-muted',
        {
          '[&>[data-slot=progress-indicator]]:bg-yellow-500 dark:[&>[data-slot=progress-indicator]]:bg-yellow-400': !isFailed && !isAlmostDone,
          '[&>[data-slot=progress-indicator]]:bg-green-700 dark:[&>[data-slot=progress-indicator]]:bg-green-600': !isFailed && isAlmostDone,
          '[&>[data-slot=progress-indicator]]:bg-destructive': isFailed,
        },
        className,
      ) }
    />
  );
}
