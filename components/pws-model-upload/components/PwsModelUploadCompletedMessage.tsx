import { CircleCheck } from 'lucide-react';

import { cn } from '@/lib/utils';
import RowStack from '@/shared/components/RowStack';
import Typography from '@/components/typography/Typography';

import { PWS_MODEL_UPLOAD_COMPLETED_MESSAGE } from '../constants/pws-model-upload.constants';

interface PwsModelUploadCompletedMessageProps {
  message?: string;
  className?: string;
}

/** Shown once every file of the session reached the server. */
export default function PwsModelUploadCompletedMessage({ message = PWS_MODEL_UPLOAD_COMPLETED_MESSAGE, className }: PwsModelUploadCompletedMessageProps) {
  return (
    <RowStack role="status" className={ cn('items-center gap-x-2 text-green-700 dark:text-green-500', className) }>
      <CircleCheck className="size-4 shrink-0" />
      <Typography variant="body1" className="font-medium">
        { message }
      </Typography>
    </RowStack>
  );
}
