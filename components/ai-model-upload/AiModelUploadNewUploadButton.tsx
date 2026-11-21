import { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';

import { AI_MODEL_UPLOAD_NEW_UPLOAD_LABEL } from './ai-model-upload.constants';

/** Leaves a finished session (its files stay listed under the bell) and brings the drop zone back. */
export default function AiModelUploadNewUploadButton({ children, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button type="button" variant="ghost" size="sm" { ...props }>
      { children ?? AI_MODEL_UPLOAD_NEW_UPLOAD_LABEL }
    </Button>
  );
}
