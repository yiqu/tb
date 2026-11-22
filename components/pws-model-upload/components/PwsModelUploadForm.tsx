'use client';

import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { useRef, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';

import { useAiModelUpload } from '../hooks/useAiModelUpload';
import AiModelUploadTextField from './AiModelUploadTextField';
import AiModelUploadActionBar from './AiModelUploadActionBar';
import AiModelUploadRetryButton from './AiModelUploadRetryButton';
import AiModelUploadStatusList from './AiModelUploadStatusList';
import AiModelUploadSubmitButton from './AiModelUploadSubmitButton';
import AiModelUploadFailedMessage from './AiModelUploadFailedMessage';
import AiModelUploadNewUploadButton from './AiModelUploadNewUploadButton';
import AiModelUploadInProgressAlert from './AiModelUploadInProgressAlert';
import AiModelUploadRejectedMessage from './AiModelUploadRejectedMessage';
import AiModelUploadCompletedMessage from './AiModelUploadCompletedMessage';
import AiModelUploadInProgressSection from './AiModelUploadInProgressSection';
import { aiModelUploadSchema, AiModelUploadFormValues } from '../schemas/ai-model-upload.schema';

import type { AiModelUploadItem } from '../models/ai-model-upload.models';
import { useAiModelUploadDraft, useAiModelUploadActions, AI_MODEL_UPLOAD_EMPTY_DRAFT } from '../store/ai-model-upload.store';
import {
  AI_MODEL_UPLOAD_PHASE,
  AI_MODEL_UPLOAD_NAME_LABEL,
  AI_MODEL_UPLOAD_MODEL_KEY_LABEL,
  AI_MODEL_UPLOAD_NAME_PLACEHOLDER,
  AI_MODEL_UPLOAD_MODEL_KEY_PLACEHOLDER,
} from '../constants/ai-model-upload.constants';

// FilePond is only needed once the dialog shows the drop zone, so it is loaded then and kept out of the page's main bundle
const AiModelUploadDropzone = dynamic(() => {
  return import('./AiModelUploadDropzone');
}, {
  ssr: false,
  loading: () => {
    return <Skeleton className="h-56 w-full" />;
  },
});

/** Files of one drop or browse are added one after the other, rejections within this window belong to the same selection. */
const REJECTED_MESSAGE_GRACE_MS = 1000;

interface AiModelUploadFormProps {
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
export default function AiModelUploadForm({ allowMultiple, allowedExtensions }: AiModelUploadFormProps) {
  const { phase, stagedFiles, sessionBatchId, sessionUploads, hasStarted, isUploading, setStagedFiles, startUpload, endSession } = useAiModelUpload();
  const draft = useAiModelUploadDraft();
  const { setDraft } = useAiModelUploadActions();
  const [rejectedFileNames, setRejectedFileNames] = useState<string[]>([]);
  const lastRejectedAtRef = useRef<number>(0);

  // reopened on a failed upload: Upload already cleared the draft, so the fields show what that upload was sent with
  const sessionUpload: AiModelUploadItem | undefined = sessionUploads[0];
  const methods = useForm<AiModelUploadFormValues>({
    defaultValues: sessionUpload ? { name: sessionUpload.name, modelKey: sessionUpload.modelKey } : draft,
    resolver: zodResolver(aiModelUploadSchema),
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

  const handleOnUpload = (values: AiModelUploadFormValues) => {
    // pressing Enter in a field submits the form too, there may be nothing to upload yet
    if (stagedFiles.length === 0) {
      return;
    }
    // the JSON body of the start request: `name` replaces the file's own name on the backend
    startUpload(values);
    // the next upload starts with empty fields
    setDraft(AI_MODEL_UPLOAD_EMPTY_DRAFT);
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
    methods.reset(AI_MODEL_UPLOAD_EMPTY_DRAFT);
    endSession();
  };

  return (
    <form onSubmit={ methods.handleSubmit(handleOnUpload) } noValidate>
      <ColumnStack className="w-full gap-y-4">
        { /* uploads from an earlier press of Upload that are still running, same rows as the notifications popover */ }
        <AiModelUploadInProgressSection excludeBatchId={ sessionBatchId } withDivider />

        <AiModelUploadTextField
          control={ methods.control }
          name="name"
          label={ AI_MODEL_UPLOAD_NAME_LABEL }
          placeholder={ AI_MODEL_UPLOAD_NAME_PLACEHOLDER }
          disabled={ hasStarted }
        />
        <AiModelUploadTextField
          control={ methods.control }
          name="modelKey"
          label={ AI_MODEL_UPLOAD_MODEL_KEY_LABEL }
          placeholder={ AI_MODEL_UPLOAD_MODEL_KEY_PLACEHOLDER }
          disabled={ hasStarted }
        />

        <Separator />

        { isUploading ?
          <AiModelUploadInProgressAlert />
        : null }

        { hasStarted ?
          <AiModelUploadStatusList uploads={ sessionUploads } />
        : <ColumnStack className="gap-y-2">
          <AiModelUploadDropzone
            files={ stagedFiles }
            onFilesChange={ handleOnFilesChange }
            allowedExtensions={ allowedExtensions }
            allowMultiple={ allowMultiple }
            onFileRejected={ handleOnFileRejected }
            className={ allowMultiple ? 'h-56' : 'h-36' }
          />
          <AiModelUploadRejectedMessage fileNames={ rejectedFileNames } allowedExtensions={ allowedExtensions } />
        </ColumnStack>
        }

        { phase === AI_MODEL_UPLOAD_PHASE.staging || phase === AI_MODEL_UPLOAD_PHASE.uploading ?
          <AiModelUploadActionBar>
            <AiModelUploadSubmitButton type="submit" isUploading={ isUploading } disabled={ !isFormValid } />
          </AiModelUploadActionBar>
        : null }

        { phase === AI_MODEL_UPLOAD_PHASE.completed ?
          <AiModelUploadActionBar className="justify-between">
            <AiModelUploadCompletedMessage />
            <AiModelUploadNewUploadButton onClick={ handleOnNewUploadAfterSuccess } />
          </AiModelUploadActionBar>
        : null }
        { phase === AI_MODEL_UPLOAD_PHASE.failed ?
          <AiModelUploadActionBar className="justify-between">
            <AiModelUploadFailedMessage />
            <RowStack className="items-center gap-x-2">
              <AiModelUploadNewUploadButton onClick={ handleOnNewUploadAfterFailure } />
              { /* optional: remove this element to take the retry feature out */ }
              <AiModelUploadRetryButton />
            </RowStack>
          </AiModelUploadActionBar>
        : null }
      </ColumnStack>
    </form>
  );
}
