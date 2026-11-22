import { cn } from '@/lib/utils';
import { DialogTitle, DialogHeader, DialogContent } from '@/components/ui/dialog';

import PwsModelUploadForm from './PwsModelUploadForm';
import { PWS_MODEL_UPLOAD_DIALOG_TITLE } from '../constants/pws-model-upload.constants';

interface PwsModelUploadDialogContentProps {
  allowMultiple: boolean;
  allowedExtensions: readonly string[];
  title?: string;
  className?: string;
}

/** The upload dialog's panel: title and form. Goes inside a shadcn `<Dialog>`, see `UploadModelButton`. */
export default function PwsModelUploadDialogContent({
  allowMultiple,
  allowedExtensions,
  title = PWS_MODEL_UPLOAD_DIALOG_TITLE,
  className,
}: PwsModelUploadDialogContentProps) {
  return (
    <DialogContent
      showCloseButton
      // the form explains itself, there is no separate description
      aria-describedby={ undefined }
      className={ cn('max-h-[90vh] max-w-[min(600px,calc(100%-2rem))] overflow-y-auto sm:max-w-[600px]', className) }
    >
      <DialogHeader>
        <DialogTitle>{ title }</DialogTitle>
      </DialogHeader>
      <PwsModelUploadForm allowMultiple={ allowMultiple } allowedExtensions={ allowedExtensions } />
    </DialogContent>
  );
}
