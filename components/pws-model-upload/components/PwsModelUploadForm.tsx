'use client';

import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { useRef, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';

import { usePwsModelUpload } from '../hooks/usePwsModelUpload';
import PwsModelUploadTextField from './PwsModelUploadTextField';
import PwsModelUploadActionBar from './PwsModelUploadActionBar';
import PwsModelUploadRetryButton from './PwsModelUploadRetryButton';
import PwsModelUploadStatusList from './PwsModelUploadStatusList';
import PwsModelUploadSubmitButton from './PwsModelUploadSubmitButton';
import PwsModelUploadFailedMessage from './PwsModelUploadFailedMessage';
import PwsModelUploadNewUploadButton from './PwsModelUploadNewUploadButton';
import PwsModelUploadInProgressAlert from './PwsModelUploadInProgressAlert';
import PwsModelUploadRejectedMessage from './PwsModelUploadRejectedMessage';
import PwsModelUploadCompletedMessage from './PwsModelUploadCompletedMessage';
import PwsModelUploadInProgressSection from './PwsModelUploadInProgressSection';
import { pwsModelUploadSchema, PwsModelUploadFormValues } from '../schemas/pws-model-upload.schema';

import type { PwsModelUploadItem } from '../models/pws-model-upload.models';
import { usePwsModelUploadDraft, usePwsModelUploadActions, PWS_MODEL_UPLOAD_EMPTY_DRAFT } from '../store/pws-model-upload.store';
import {
  PWS_MODEL_UPLOAD_PHASE,
  PWS_MODEL_UPLOAD_NAME_LABEL,
  PWS_MODEL_UPLOAD_MODEL_KEY_LABEL,
  PWS_MODEL_UPLOAD_NAME_PLACEHOLDER,
  PWS_MODEL_UPLOAD_MODEL_KEY_PLACEHOLDER,
} from '../constants/pws-model-upload.constants';

// FilePond is only needed once the dialog shows the drop zone, so it is loaded then and kept out of the page's main bundle
const PwsModelUploadDropzone = dynamic(() => {
  return import('./PwsModelUploadDropzone');
}, {
  ssr: false,
  loading: () => {
    return <Skeleton className="h-56 w-full" />;
  },
});

/** Files of one drop or browse are added one after the other, rejections within this window belong to the same selection. */
const REJECTED_MESSAGE_GRACE_MS = 1000;

interface PwsModelUploadFormProps {
  /** Let the drop zone take more than one file. Every file then becomes its own upload with the same name and model key. */
  allowMultiple: boolean;
  /** File types the drop zone accepts, e.g. `['.onnx']`. Empty allows every type. */
  allowedExtensions: readonly string[];
}

/**
 * The body of the upload dialog, one block per phase:
 *
 * - opened while earlier uploads are still running: their progress on top, then a divider, then the form below
 * - empty / staging: name, model key, divider, drop zone (FilePond lists the staged file itself)
 * - staging: the action bar with the Upload button shows up, enabled once name and model key are valid
 * - uploading: an info alert says the dialog can be closed, the drop zone is replaced by the progress, the Upload button is disabled with a spinner
 * - completed: "Upload completed" and a "New upload" button that goes back to an empty form
 * - failed: a message, a "New upload" button that goes back to the drop zone, and the Retry button
 */
export default function PwsModelUploadForm({ allowMultiple, allowedExtensions }: PwsModelUploadFormProps) {
  const { phase, stagedFiles, sessionBatchId, sessionUploads, hasStarted, isUploading, setStagedFiles, startUpload, endSession } = usePwsModelUpload();
  const draft = usePwsModelUploadDraft();
  const { setDraft } = usePwsModelUploadActions();
  const [rejectedFileNames, setRejectedFileNames] = useState<string[]>([]);
  const lastRejectedAtRef = useRef<number>(0);

  // reopened on a failed upload: Upload already cleared the draft, so the fields show what that upload was sent with
  const sessionUpload: PwsModelUploadItem | undefined = sessionUploads[0];
  const methods = useForm<PwsModelUploadFormValues>({
    defaultValues: sessionUpload ? { name: sessionUpload.name, modelKey: sessionUpload.modelKey } : draft,
    resolver: zodResolver(pwsModelUploadSchema),
    mode: 'onChange',
  });

  const { watch } = methods;
  useEffect(() => {
    // keep what was typed while the dialog is closed, like the staged file
    const subscription = watch((values) => {
      setDraft({ name: values.name ?? '', modelKey: values.modelKey ?? '' });
    });
    return () => {
      subscription.unsubscribe();
    };
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
    setRejectedFileNames((current: string[]) => {
      return current.includes(fileName) ? current : [...current, fileName];
    });
  };

  const handleOnUpload = (values: PwsModelUploadFormValues) => {
    // pressing Enter in a field submits the form too, there may be nothing to upload yet
    if (stagedFiles.length === 0) {
      return;
    }
    // the JSON body of the start request: `name` replaces the file's own name on the backend
    startUpload(values);
    // the next upload starts with empty fields
    setDraft(PWS_MODEL_UPLOAD_EMPTY_DRAFT);
  };

  /** After a failure: back to the drop zone, the name and model key stay for the next try. */
  const handleOnNewUploadAfterFailure = () => {
    // a new selection starts clean, the last selection's rejected names no longer apply
    setRejectedFileNames([]);
    // Upload cleared the draft but the fields still show the values, save them back so a reopen keeps them too
    setDraft({ name: methods.getValues('name') ?? '', modelKey: methods.getValues('modelKey') ?? '' });
    endSession();
  };

  /** After a success: back to an empty form, for the next model. */
  const handleOnNewUploadAfterSuccess = () => {
    setRejectedFileNames([]);
    methods.reset(PWS_MODEL_UPLOAD_EMPTY_DRAFT);
    endSession();
  };

  return (
    <form onSubmit={ methods.handleSubmit(handleOnUpload) } noValidate>
      <ColumnStack className="w-full gap-y-4">
        { /* uploads from an earlier press of Upload that are still running, same rows as the notifications popover */ }
        <PwsModelUploadInProgressSection excludeBatchId={ sessionBatchId } withDivider />

        <PwsModelUploadTextField
          control={ methods.control }
          name="name"
          label={ PWS_MODEL_UPLOAD_NAME_LABEL }
          placeholder={ PWS_MODEL_UPLOAD_NAME_PLACEHOLDER }
          disabled={ hasStarted }
        />
        <PwsModelUploadTextField
          control={ methods.control }
          name="modelKey"
          label={ PWS_MODEL_UPLOAD_MODEL_KEY_LABEL }
          placeholder={ PWS_MODEL_UPLOAD_MODEL_KEY_PLACEHOLDER }
          disabled={ hasStarted }
        />

        <Separator />

        { isUploading ?
          <PwsModelUploadInProgressAlert />
        : null }

        { hasStarted ?
          <PwsModelUploadStatusList uploads={ sessionUploads } />
        : <ColumnStack className="gap-y-2">
          <PwsModelUploadDropzone
            files={ stagedFiles }
            onFilesChange={ handleOnFilesChange }
            allowedExtensions={ allowedExtensions }
            allowMultiple={ allowMultiple }
            onFileRejected={ handleOnFileRejected }
            className={ allowMultiple ? 'h-56' : 'h-36' }
          />
          <PwsModelUploadRejectedMessage fileNames={ rejectedFileNames } allowedExtensions={ allowedExtensions } />
        </ColumnStack>
        }

        { phase === PWS_MODEL_UPLOAD_PHASE.staging || phase === PWS_MODEL_UPLOAD_PHASE.uploading ?
          <PwsModelUploadActionBar>
            <PwsModelUploadSubmitButton type="submit" isUploading={ isUploading } disabled={ !isFormValid } />
          </PwsModelUploadActionBar>
        : null }

        { phase === PWS_MODEL_UPLOAD_PHASE.completed ?
          <PwsModelUploadActionBar className="justify-between">
            <PwsModelUploadCompletedMessage />
            <PwsModelUploadNewUploadButton onClick={ handleOnNewUploadAfterSuccess } />
          </PwsModelUploadActionBar>
        : null }
        { phase === PWS_MODEL_UPLOAD_PHASE.failed ?
          <PwsModelUploadActionBar className="justify-between">
            <PwsModelUploadFailedMessage />
            <RowStack className="items-center gap-x-2">
              <PwsModelUploadNewUploadButton onClick={ handleOnNewUploadAfterFailure } />
              { /* optional: remove this element to take the retry feature out */ }
              <PwsModelUploadRetryButton />
            </RowStack>
          </PwsModelUploadActionBar>
        : null }
      </ColumnStack>
    </form>
  );
}
