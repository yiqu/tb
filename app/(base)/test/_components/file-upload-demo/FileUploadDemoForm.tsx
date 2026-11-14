'use client';

import { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Separator } from '@/components/ui/separator';
import ColumnStack from '@/shared/components/ColumnStack';
import { HFInputField } from '@/components/hook-form/HFFieldInput';
import { useFileUpload } from '@/components/file-upload/useFileUpload';
import FileUploadButton from '@/components/file-upload/FileUploadButton';
import FileUploadDropzone from '@/components/file-upload/FileUploadDropzone';
import FileUploadActionBar from '@/components/file-upload/FileUploadActionBar';
import FileUploadStatusList from '@/components/file-upload/FileUploadStatusList';
import { FILE_UPLOAD_PHASE } from '@/components/file-upload/file-upload.constants';
import FileUploadInProgressAlert from '@/components/file-upload/FileUploadInProgressAlert';
import FileUploadRetryButton from '@/components/file-upload/FileUploadRetryButton';
import FileUploadInProgressSection from '@/components/file-upload/FileUploadInProgressSection';
import FileUploadFailedMessage from '@/components/file-upload/FileUploadFailedMessage';
import FileUploadRejectedMessage from '@/components/file-upload/FileUploadRejectedMessage';
import FileUploadCompletedMessage from '@/components/file-upload/FileUploadCompletedMessage';
import { fileUploadPackageSchema, FileUploadPackageFormValues } from '@/validators/file-upload/file-upload-package.schema';

import { useFileUploadDemoStore } from './file-upload-demo.store';
import { FILE_UPLOAD_DEMO_SERVER, FILE_UPLOAD_DEMO_ALLOWED_EXTENSIONS } from './file-upload-demo.constants';

/** Files of one drop or browse are added one after the other, rejections within this window belong to the same selection. */
const REJECTED_MESSAGE_GRACE_MS = 1000;

/**
 * The body of the upload dialog, one block per phase:
 *
 * - reopened while earlier uploads are still running: their progress on top, then a divider, then the form below
 * - empty / staging: package name, divider, drop zone (FilePond lists the staged files itself)
 * - staging: the action bar with the Upload button shows up
 * - uploading: an info alert says the dialog can be closed, the drop zone is replaced by the progress of each file, the Upload button is disabled with a spinner
 * - completed: "Upload completed", the Upload button is gone
 * - failed: a message and the retry button, which sends only the failed files again
 */
export default function FileUploadDemoForm() {
  const { phase, stagedFiles, sessionBatchId, sessionUploads, hasStarted, isUploading, setStagedFiles, startUpload } = useFileUpload(FILE_UPLOAD_DEMO_SERVER);
  const draftPackageName = useFileUploadDemoStore((state) => state.draftPackageName);
  const setDraftPackageName = useFileUploadDemoStore((state) => state.setDraftPackageName);
  const [rejectedFileNames, setRejectedFileNames] = useState<string[]>([]);
  const lastRejectedAtRef = useRef<number>(0);

  const methods = useForm<FileUploadPackageFormValues>({
    defaultValues: { packageName: draftPackageName },
    resolver: zodResolver(fileUploadPackageSchema),
    mode: 'onChange',
  });

  const { watch } = methods;
  useEffect(() => {
    // keep the typed package name while the dialog is closed, like the staged files
    const subscription = watch((values) => setDraftPackageName(values.packageName ?? ''));
    return () => subscription.unsubscribe();
  }, [watch, setDraftPackageName]);

  const handleOnFilesChange = (files: File[]) => {
    // a later selection clears the "skipped" message, the selection that caused it does not
    if (Date.now() - lastRejectedAtRef.current > REJECTED_MESSAGE_GRACE_MS) {
      setRejectedFileNames([]);
    }
    setStagedFiles(files);
  };

  const handleOnFileRejected = (fileName: string) => {
    lastRejectedAtRef.current = Date.now();
    setRejectedFileNames((current: string[]) => (current.includes(fileName) ? current : [...current, fileName]));
  };

  const handleOnUpload = (data: FileUploadPackageFormValues) => {
    // pressing Enter in the package name submits the form too, there may be nothing to upload yet
    if (stagedFiles.length === 0) {
      return;
    }
    // FilePond posts the metadata next to every file, under the same field name
    startUpload({ packageName: data.packageName });
    setDraftPackageName('');
  };

  return (
    <form onSubmit={ methods.handleSubmit(handleOnUpload) } noValidate>
      <ColumnStack className="w-full gap-y-4">
        { /* uploads from an earlier press of Upload that are still running, same rows as the notifications popover */ }
        <FileUploadInProgressSection excludeBatchId={ sessionBatchId } withDivider />

        <HFInputField
          control={ methods.control }
          name="packageName"
          label="Package Name"
          placeholder="Enter a package name"
          autoComplete="off"
          disabled={ hasStarted }
        />

        <Separator />

        { isUploading ?
          <FileUploadInProgressAlert />
        : null }

        { hasStarted ?
          <FileUploadStatusList uploads={ sessionUploads } />
        : <ColumnStack className="gap-y-2">
          <FileUploadDropzone
            files={ stagedFiles }
            onFilesChange={ handleOnFilesChange }
            allowedExtensions={ FILE_UPLOAD_DEMO_ALLOWED_EXTENSIONS }
            onFileRejected={ handleOnFileRejected }
            className="h-56"
          />
          <FileUploadRejectedMessage fileNames={ rejectedFileNames } allowedExtensions={ FILE_UPLOAD_DEMO_ALLOWED_EXTENSIONS } />
        </ColumnStack>
        }

        { phase === FILE_UPLOAD_PHASE.staging || phase === FILE_UPLOAD_PHASE.uploading ?
          <FileUploadActionBar>
            <FileUploadButton type="submit" isUploading={ isUploading } />
          </FileUploadActionBar>
        : null }

        { phase === FILE_UPLOAD_PHASE.completed ?
          <FileUploadCompletedMessage />
        : null }
        { phase === FILE_UPLOAD_PHASE.failed ?
          <FileUploadActionBar className="justify-between">
            <FileUploadFailedMessage />
            { /* optional: remove this element to take the retry feature out */ }
            <FileUploadRetryButton />
          </FileUploadActionBar>
        : null }
      </ColumnStack>
    </form>
  );
}
