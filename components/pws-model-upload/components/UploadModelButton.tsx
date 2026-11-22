'use client';

import { Upload } from 'lucide-react';
import { useState, ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import { usePwsModelUploadStore } from '../store/pws-model-upload.store';
import PwsModelUploadDialogContent from './PwsModelUploadDialogContent';
import { PWS_MODEL_UPLOAD_STATUS, PWS_MODEL_UPLOAD_BUTTON_LABEL, PWS_MODEL_UPLOAD_DEFAULT_ALLOWED_EXTENSIONS } from '../constants/pws-model-upload.constants';

import type { PwsModelUploadItem } from '../models/pws-model-upload.models';

// `asChild` is left out: the trigger always renders an icon and a label, and Radix `Slot` takes a single child
interface UploadModelButtonProps extends Omit<ComponentProps<typeof Button>, 'onClick' | 'type' | 'asChild'> {
  /** Let the drop zone take more than one file, each becomes its own upload with the same name and model key. Defaults to one file. */
  allowMultiple?: boolean;
  /** File types the drop zone accepts, e.g. `['.onnx', '.pt']`. Defaults to every type. */
  allowedExtensions?: readonly string[];
}

/**
 * The entry point of the feature: an "Upload Model" button that opens the upload dialog. Drop it
 * anywhere. Uploads keep running when the dialog closes, and the dialog can be opened again to start
 * another upload while earlier ones are still going.
 */
export default function UploadModelButton({
  allowMultiple = false,
  allowedExtensions = PWS_MODEL_UPLOAD_DEFAULT_ALLOWED_EXTENSIONS,
  size = 'sm',
  children,
  ...buttonProps
}: UploadModelButtonProps) {
  const [open, setOpen] = useState<boolean>(false);

  const handleOnOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      // once Upload was pressed the dialog starts empty the next time, a file that was only staged is kept.
      // Done on open and not on close, so the progress stays in place while the dialog fades out.
      // A session with a failed file stays, so its Retry button is still there after reopening.
      const { uploads, sessionBatchId, actions } = usePwsModelUploadStore.getState();
      const hasFailedSessionUploads: boolean = uploads.some(
        (upload: PwsModelUploadItem) => {
          return upload.batchId === sessionBatchId && upload.status === PWS_MODEL_UPLOAD_STATUS.failed;
        },
      );
      if (!hasFailedSessionUploads) {
        actions.endSession();
      }
    }
    setOpen(nextOpen);
  };

  return (
    <Dialog open={ open } onOpenChange={ handleOnOpenChange }>
      <DialogTrigger asChild>
        <Button type="button" size={ size } { ...buttonProps }>
          <Upload />
          { children ?? PWS_MODEL_UPLOAD_BUTTON_LABEL }
        </Button>
      </DialogTrigger>
      <PwsModelUploadDialogContent allowMultiple={ allowMultiple } allowedExtensions={ allowedExtensions } />
    </Dialog>
  );
}
