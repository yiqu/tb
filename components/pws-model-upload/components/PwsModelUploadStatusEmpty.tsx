import { cn } from '@/lib/utils';
import Typography from '@/components/typography/Typography';

import { PWS_MODEL_UPLOAD_EMPTY_STATUS_MESSAGE } from '../constants/pws-model-upload.constants';

interface PwsModelUploadStatusEmptyProps {
  message?: string;
  className?: string;
}

/** Placeholder for an upload status list with nothing in it. */
export default function PwsModelUploadStatusEmpty({ message = PWS_MODEL_UPLOAD_EMPTY_STATUS_MESSAGE, className }: PwsModelUploadStatusEmptyProps) {
  return (
    <Typography variant="caption1" className={ cn(className) }>
      { message }
    </Typography>
  );
}
