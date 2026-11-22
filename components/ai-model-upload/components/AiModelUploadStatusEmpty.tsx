import { cn } from '@/lib/utils';
import Typography from '@/components/typography/Typography';

import { AI_MODEL_UPLOAD_EMPTY_STATUS_MESSAGE } from '../constants/ai-model-upload.constants';

interface AiModelUploadStatusEmptyProps {
  message?: string;
  className?: string;
}

/** Placeholder for an upload status list with nothing in it. */
export default function AiModelUploadStatusEmpty({ message = AI_MODEL_UPLOAD_EMPTY_STATUS_MESSAGE, className }: AiModelUploadStatusEmptyProps) {
  return (
    <Typography variant="caption1" className={ cn(className) }>
      { message }
    </Typography>
  );
}
