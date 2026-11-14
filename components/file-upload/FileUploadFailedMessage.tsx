import { CircleAlert } from 'lucide-react';

import { cn } from '@/lib/utils';
import RowStack from '@/shared/components/RowStack';
import Typography from '@/components/typography/Typography';

interface FileUploadFailedMessageProps {
  message?: string;
  className?: string;
}

/** Shown when the session is finished and at least one file did not reach the server. */
export default function FileUploadFailedMessage({ message = 'Some files failed to upload', className }: FileUploadFailedMessageProps) {
  return (
    <RowStack role="alert" className={ cn('items-center gap-x-2 text-destructive', className) }>
      <CircleAlert className="size-4 shrink-0" />
      <Typography variant="body1" className="font-medium">
        { message }
      </Typography>
    </RowStack>
  );
}
