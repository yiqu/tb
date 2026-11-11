import { Upload } from 'lucide-react';
import { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface FileUploadButtonProps extends ComponentProps<typeof Button> {
  /** While true the button is disabled and its icon is a spinner. */
  isUploading?: boolean;
}

/** Starts the upload. Turns into a disabled button with a spinner while files are uploading. */
export default function FileUploadButton({ isUploading = false, disabled, children, ...props }: FileUploadButtonProps) {
  return (
    <Button type="button" disabled={ isUploading || disabled } aria-busy={ isUploading } { ...props }>
      { isUploading ?
        <Spinner />
      : <Upload /> }
      { children ?? (isUploading ? 'Uploading' : 'Upload') }
    </Button>
  );
}
