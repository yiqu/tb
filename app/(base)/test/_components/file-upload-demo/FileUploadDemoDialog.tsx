'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import RowStack from '@/shared/components/RowStack';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import StyledDialogContent from '@/shared/dialogs/StyledDialogContent';
import { useFileUploadActions } from '@/components/file-upload/file-upload.store';

import FileUploadDemoForm from './FileUploadDemoForm';

/** The "Upload Files" button and its dialog. Clicking the backdrop closes the dialog, uploads keep running. */
export default function FileUploadDemoDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const { endSession } = useFileUploadActions();

  const handleOnOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      // once Upload was pressed the dialog starts empty the next time, files that were only staged are kept
      endSession();
    }
  };

  return (
    <RowStack>
      <Dialog open={ open } onOpenChange={ handleOnOpenChange }>
        <DialogTrigger asChild>
          <Button type="button" size="sm">
            <Upload />
            Upload Files
          </Button>
        </DialogTrigger>
        <StyledDialogContent
          headerTitle="Upload Files"
          className="
            max-w-[min(600px,calc(100%-2rem))]
            sm:max-w-[600px]
            md:max-w-[600px]
            lg:max-w-[600px]
          "
          contentWrapperClassName="pb-4"
        >
          <FileUploadDemoForm />
        </StyledDialogContent>
      </Dialog>
    </RowStack>
  );
}
