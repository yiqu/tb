'use client';

import { Button } from '@/components/ui/button';

import { getInProgressPwsModelUploads } from '../utils/pws-model-upload.utils';
import { PWS_MODEL_UPLOAD_CLEAR_FINISHED_LABEL } from '../constants/pws-model-upload.constants';
import { usePwsModelUploads, usePwsModelUploadActions } from '../store/pws-model-upload.store';
import { usePwsModelUploadCancelMutation } from '../hooks/usePwsModelUploadCancelMutation';

import type { PwsModelUploadItem } from '../models/pws-model-upload.models';

/**
 * Removes the batches that finished (completed or failed) from the status list, and stops the cleared
 * failed uploads on the server (nothing will finish them any more). Hidden while there is
 * nothing to clear.
 */
export default function PwsModelUploadClearFinishedButton() {
  const uploads = usePwsModelUploads();
  const { clearFinishedUploads } = usePwsModelUploadActions();
  const { mutate: cancelUpload } = usePwsModelUploadCancelMutation();
  // a batch with a file still running is kept whole, so only the uploads outside of those can be cleared
  const hasFinishedUploads: boolean = getInProgressPwsModelUploads(uploads).length < uploads.length;

  if (!hasFinishedUploads) {
    return null;
  }

  const handleOnClear = () => {
    clearFinishedUploads().forEach((upload: PwsModelUploadItem) => {
      if (upload.artifactId !== null) {
        cancelUpload({ artifactId: upload.artifactId, uploadLength: upload.size });
      }
    });
  };

  return (
    <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={ handleOnClear }>
      { PWS_MODEL_UPLOAD_CLEAR_FINISHED_LABEL }
    </Button>
  );
}
