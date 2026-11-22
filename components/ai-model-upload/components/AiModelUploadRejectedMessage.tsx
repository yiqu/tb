import { cn } from '@/lib/utils';
import Typography from '@/components/typography/Typography';

interface AiModelUploadRejectedMessageProps {
  /** Names of the files that were not accepted. Renders nothing when empty. */
  fileNames: string[];
  allowedExtensions?: readonly string[];
  className?: string;
}

/** Tells the user which dropped or browsed files were skipped because their extension is not allowed. */
export default function AiModelUploadRejectedMessage({ fileNames, allowedExtensions, className }: AiModelUploadRejectedMessageProps) {
  if (fileNames.length === 0) {
    return null;
  }
  return (
    <Typography variant="body0" role="alert" className={ cn('text-destructive', className) }>
      { allowedExtensions && allowedExtensions.length > 0 ? `Only ${allowedExtensions.join(', ')} files are allowed. ` : '' }
      Skipped: { fileNames.join(', ') }
    </Typography>
  );
}
