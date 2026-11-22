import { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';

import { PWS_MODEL_UPLOAD_NEW_UPLOAD_LABEL } from '../constants/pws-model-upload.constants';

/** Leaves a finished session (its files stay listed under the bell) and brings the drop zone back. */
export default function PwsModelUploadNewUploadButton({ children, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button type="button" variant="ghost" size="sm" { ...props }>
      { children ?? PWS_MODEL_UPLOAD_NEW_UPLOAD_LABEL }
    </Button>
  );
}
