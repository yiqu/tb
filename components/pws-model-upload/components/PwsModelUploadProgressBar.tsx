import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

import { clampProgress } from '../utils/ai-model-upload.utils';
import { AI_MODEL_UPLOAD_PROGRESS_COLOR_THRESHOLD } from '../constants/ai-model-upload.constants';

interface AiModelUploadProgressBarProps {
  /** 0 to 100. */
  progress: number;
  isFailed?: boolean;
  /** Accessible name of the bar, e.g. `notes.txt upload progress`, so screen readers can tell the bars apart. */
  label?: string;
  className?: string;
}

/** Horizontal progress bar: yellow below 70%, dark green from 70% on, red when the upload failed. */
export default function AiModelUploadProgressBar({ progress, isFailed = false, label, className }: AiModelUploadProgressBarProps) {
  const value: number = clampProgress(progress);
  const isAlmostDone: boolean = value >= AI_MODEL_UPLOAD_PROGRESS_COLOR_THRESHOLD;

  return (
    <Progress
      value={ value }
      aria-label={ label }
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
