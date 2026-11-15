import { cn } from '@/lib/utils';
import Typography from '@/components/typography/Typography';

interface FileUploadStatusEmptyProps {
  message?: string;
  className?: string;
}

/** Placeholder for an upload status list with nothing in it. */
export default function FileUploadStatusEmpty({ message = 'No uploads yet.', className }: FileUploadStatusEmptyProps) {
  return (
    <Typography variant="caption1" className={ cn(className) }>
      { message }
    </Typography>
  );
}
