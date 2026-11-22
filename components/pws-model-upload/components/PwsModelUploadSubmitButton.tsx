import { Upload } from 'lucide-react';
import { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import { PWS_MODEL_UPLOAD_SUBMIT_LABEL, PWS_MODEL_UPLOAD_SUBMITTING_LABEL } from '../constants/pws-model-upload.constants';

interface PwsModelUploadSubmitButtonProps extends ComponentProps<typeof Button> {
  /** While true the button is disabled and its icon is a spinner. */
  isUploading?: boolean;
}

/** Starts the upload. Turns into a disabled button with a spinner while files are uploading. */
export default function PwsModelUploadSubmitButton({ isUploading = false, disabled, children, ...props }: PwsModelUploadSubmitButtonProps) {
  return (
    <Button type="button" disabled={ isUploading || disabled } aria-busy={ isUploading } { ...props }>
      { isUploading ?
        <Spinner />
      : <Upload /> }
      { children ?? (isUploading ? PWS_MODEL_UPLOAD_SUBMITTING_LABEL : PWS_MODEL_UPLOAD_SUBMIT_LABEL) }
    </Button>
  );
}
