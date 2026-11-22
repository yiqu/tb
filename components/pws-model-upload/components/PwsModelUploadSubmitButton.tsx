import { Upload } from 'lucide-react';
import { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import { AI_MODEL_UPLOAD_SUBMIT_LABEL, AI_MODEL_UPLOAD_SUBMITTING_LABEL } from '../constants/ai-model-upload.constants';

interface AiModelUploadSubmitButtonProps extends ComponentProps<typeof Button> {
  /** While true the button is disabled and its icon is a spinner. */
  isUploading?: boolean;
}

/** Starts the upload. Turns into a disabled button with a spinner while files are uploading. */
export default function AiModelUploadSubmitButton({ isUploading = false, disabled, children, ...props }: AiModelUploadSubmitButtonProps) {
  return (
    <Button type="button" disabled={ isUploading || disabled } aria-busy={ isUploading } { ...props }>
      { isUploading ?
        <Spinner />
      : <Upload /> }
      { children ?? (isUploading ? AI_MODEL_UPLOAD_SUBMITTING_LABEL : AI_MODEL_UPLOAD_SUBMIT_LABEL) }
    </Button>
  );
}
