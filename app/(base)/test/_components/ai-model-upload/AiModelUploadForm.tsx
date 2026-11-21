'use client';

import dynamic from 'next/dynamic';
import { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import RowStack from '@/shared/components/RowStack';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import ColumnStack from '@/shared/components/ColumnStack';
import { HFInputField } from '@/components/hook-form/HFFieldInput';
import { useFileUpload } from '@/components/file-upload/useFileUpload';
import FileUploadButton from '@/components/file-upload/FileUploadButton';
import FileUploadActionBar from '@/components/file-upload/FileUploadActionBar';
import FileUploadStatusList from '@/components/file-upload/FileUploadStatusList';
import { FILE_UPLOAD_PHASE } from '@/components/file-upload/file-upload.constants';
import FileUploadInProgressAlert from '@/components/file-upload/FileUploadInProgressAlert';
import FileUploadRetryButton from '@/components/file-upload/FileUploadRetryButton';
import FileUploadInProgressSection from '@/components/file-upload/FileUploadInProgressSection';
import FileUploadFailedMessage from '@/components/file-upload/FileUploadFailedMessage';
import FileUploadRejectedMessage from '@/components/file-upload/FileUploadRejectedMessage';
import FileUploadCompletedMessage from '@/components/file-upload/FileUploadCompletedMessage';
import { aiModelUploadSchema, AiModelUploadFormValues } from '@/validators/ai-model-upload/ai-model-upload.schema';

import { useAiModelUploadStore, AI_MODEL_UPLOAD_EMPTY_DRAFT } from './ai-model-upload.store';
import {
  AI_MODEL_UPLOAD_SERVER,
  AI_MODEL_UPLOAD_NAME_LABEL,
  AI_MODEL_UPLOAD_ALLOW_MULTIPLE,
  AI_MODEL_UPLOAD_NEW_UPLOAD_LABEL,
  AI_MODEL_UPLOAD_MODEL_KEY_LABEL,
  AI_MODEL_UPLOAD_NAME_PLACEHOLDER,
  AI_MODEL_UPLOAD_ALLOWED_EXTENSIONS,
  AI_MODEL_UPLOAD_MODEL_KEY_PLACEHOLDER,
} from './ai-model-upload.constants';

// FilePond is only needed once the dialog shows the drop zone, so it is loaded then and kept out of the page's main bundle
const FileUploadDropzone = dynamic(() => import('@/components/file-upload/FileUploadDropzone'), {
  ssr: false,
  loading: () => <Skeleton className="h-56 w-full" />,
});

/** Files of one drop or browse are added one after the other, rejections within this window belong to the same selection. */
const REJECTED_MESSAGE_GRACE_MS = 1000;

/**
 * The body of the upload dialog, one block per phase:
 *
 * - reopened while earlier uploads are still running: their progress on top, then a divider, then the form below
 * - empty / staging: name, model key, divider, drop zone (FilePond lists the staged file itself)
 * - staging: the action bar with the Upload button shows up, enabled once name and model key are valid
 * - uploading: an info alert says the dialog can be closed, the drop zone is replaced by the progress of each file, the Upload button is disabled with a spinner
 * - completed: "Upload completed", the Upload button is gone
 * - failed: a message, a "New upload" button that goes back to the drop zone, and the retry button, which sends only the failed files again
 */
export default function AiModelUploadForm() {
  const { phase, stagedFiles, sessionBatchId, sessionUploads, hasStarted, isUploading, setStagedFiles, startUpload, endSession } = useFileUpload(AI_MODEL_UPLOAD_SERVER);
  const draft = useAiModelUploadStore((state) => state.draft);
  const setDraft = useAiModelUploadStore((state) => state.setDraft);
  const [rejectedFileNames, setRejectedFileNames] = useState<string[]>([]);
  const lastRejectedAtRef = useRef<number>(0);

  const methods = useForm<AiModelUploadFormValues>({
    defaultValues: draft,
    resolver: zodResolver(aiModelUploadSchema),
    mode: 'onChange',
  });

  const { watch } = methods;
  useEffect(() => {
    // keep what was typed while the dialog is closed, like the staged files
    const subscription = watch((values) => setDraft({ name: values.name ?? '', modelKey: values.modelKey ?? '' }));
    return () => subscription.unsubscribe();
  }, [watch, setDraft]);
  // the Upload button stays disabled until both fields pass the schema
  const isFormValid: boolean = methods.formState.isValid;

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

  const handleOnUpload = (data: AiModelUploadFormValues) => {
    // pressing Enter in a field submits the form too, there may be nothing to upload yet
    if (stagedFiles.length === 0) {
      return;
    }
    // sent as the JSON body of the start request: `name` replaces the file's own name on the backend
    startUpload({ name: data.name, modelKey: data.modelKey });
    setDraft(AI_MODEL_UPLOAD_EMPTY_DRAFT);
  };

  const handleOnNewUpload = () => {
    // a new selection starts clean, the last selection's rejected names no longer apply
    setRejectedFileNames([]);
    // Upload cleared the draft but the fields still show the values, save them back so a reopen keeps them
    setDraft({ name: methods.getValues('name') ?? '', modelKey: methods.getValues('modelKey') ?? '' });
    endSession();
  };

  return (
    <form onSubmit={ methods.handleSubmit(handleOnUpload) } noValidate>
      <ColumnStack className="w-full gap-y-4">
        { /* uploads from an earlier press of Upload that are still running, same rows as the notifications popover */ }
        <FileUploadInProgressSection excludeBatchId={ sessionBatchId } withDivider />

        <HFInputField
          control={ methods.control }
          name="name"
          label={ AI_MODEL_UPLOAD_NAME_LABEL }
          placeholder={ AI_MODEL_UPLOAD_NAME_PLACEHOLDER }
          autoComplete="off"
          disabled={ hasStarted }
        />
        <HFInputField
          control={ methods.control }
          name="modelKey"
          label={ AI_MODEL_UPLOAD_MODEL_KEY_LABEL }
          placeholder={ AI_MODEL_UPLOAD_MODEL_KEY_PLACEHOLDER }
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
            allowedExtensions={ AI_MODEL_UPLOAD_ALLOWED_EXTENSIONS }
            allowMultiple={ AI_MODEL_UPLOAD_ALLOW_MULTIPLE }
            onFileRejected={ handleOnFileRejected }
            className="h-56"
          />
          <FileUploadRejectedMessage fileNames={ rejectedFileNames } allowedExtensions={ AI_MODEL_UPLOAD_ALLOWED_EXTENSIONS } />
        </ColumnStack>
        }

        { phase === FILE_UPLOAD_PHASE.staging || phase === FILE_UPLOAD_PHASE.uploading ?
          <FileUploadActionBar>
            <FileUploadButton type="submit" isUploading={ isUploading } disabled={ !isFormValid } />
          </FileUploadActionBar>
        : null }

        { phase === FILE_UPLOAD_PHASE.completed ?
          <FileUploadCompletedMessage />
        : null }
        { phase === FILE_UPLOAD_PHASE.failed ?
          <FileUploadActionBar className="justify-between">
            <FileUploadFailedMessage />
            <RowStack className="items-center gap-x-2">
              { /* leaves the failed files in the notifications popover and brings the drop zone back */ }
              <Button type="button" variant="ghost" size="sm" onClick={ handleOnNewUpload }>
                { AI_MODEL_UPLOAD_NEW_UPLOAD_LABEL }
              </Button>
              { /* optional: remove this element to take the retry feature out */ }
              <FileUploadRetryButton />
            </RowStack>
          </FileUploadActionBar>
        : null }
      </ColumnStack>
    </form>
  );
}
