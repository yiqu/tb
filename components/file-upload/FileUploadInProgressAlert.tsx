import { Info } from 'lucide-react';

import { cn } from '@/lib/utils';
import Typography from '@/components/typography/Typography';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

import { FILE_UPLOAD_IN_PROGRESS_ALERT_TITLE, FILE_UPLOAD_IN_PROGRESS_ALERT_MESSAGE } from './file-upload.constants';

interface FileUploadInProgressAlertProps {
  title?: string;
  message?: string;
  className?: string;
}

/** Info alert for the uploading phase: tells the user the upload keeps running if they leave. */
export default function FileUploadInProgressAlert({
  title = FILE_UPLOAD_IN_PROGRESS_ALERT_TITLE,
  message = FILE_UPLOAD_IN_PROGRESS_ALERT_MESSAGE,
  className,
}: FileUploadInProgressAlertProps) {
  return (
    <Alert
      role="status"
      className={ cn(
        'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100',
        className,
      ) }
    >
      <Info />
      <AlertTitle>
        <Typography variant="body1" as="span" className="font-medium">
          { title }
        </Typography>
      </AlertTitle>
      <AlertDescription className="text-blue-900/80 dark:text-blue-100/80">
        <Typography variant="body1">{ message }</Typography>
      </AlertDescription>
    </Alert>
  );
}
