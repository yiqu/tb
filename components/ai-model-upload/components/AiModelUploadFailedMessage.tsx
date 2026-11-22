import { CircleAlert } from 'lucide-react';

import { cn } from '@/lib/utils';
import RowStack from '@/shared/components/RowStack';
import Typography from '@/components/typography/Typography';

import { AI_MODEL_UPLOAD_FAILED_MESSAGE } from '../constants/ai-model-upload.constants';

interface AiModelUploadFailedMessageProps {
  message?: string;
  className?: string;
}

/** Shown when the session is finished and at least one file did not reach the server. */
export default function AiModelUploadFailedMessage({ message = AI_MODEL_UPLOAD_FAILED_MESSAGE, className }: AiModelUploadFailedMessageProps) {
  return (
    <RowStack role="alert" className={ cn('items-center gap-x-2 text-destructive', className) }>
      <CircleAlert className="size-4 shrink-0" />
      <Typography variant="body1" className="font-medium">
        { message }
      </Typography>
    </RowStack>
  );
}
