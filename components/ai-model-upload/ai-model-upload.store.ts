import { create } from 'zustand';

import { isAiModelUploadActive, getNextBytesPerSecond } from './ai-model-upload.utils';
import { AI_MODEL_UPLOAD_STATUS } from './ai-model-upload.constants';

import type { AiModelUploadFormValues } from './ai-model-upload.schema';
import type { AiModelUploadItem, AiModelUploadVariables, AiModelUploadRetryPlan } from './ai-model-upload.models';

/**
 * Global upload state. It lives outside of React on purpose: the dialog can be closed and unmounted
 * while uploads keep running, and other parts of the app (the notifications popover, the tab title)
 * show their progress. The requests themselves run in TanStack Query mutations
 * (`useAiModelUploadMutation`), which write their progress here.
 *
 * - `stagedFiles`     files picked in the drop zone that were not sent yet, kept so they survive the dialog closing
 * - `draft`           the name and model key typed in the form, kept for the same reason
 * - `sessionBatchId`  the batch the dialog is currently showing, null while still staging
 * - `uploads`         every file that was sent or is being sent, newest batch first
 */
interface AiModelUploadState {
  stagedFiles: File[];
  draft: AiModelUploadFormValues;
  sessionBatchId: string | null;
  uploads: AiModelUploadItem[];

  actions: {
    setStagedFiles: (files: File[]) => void;
    setDraft: (draft: AiModelUploadFormValues) => void;
    /**
     * Turns every staged file into an upload with the given name and model key, and makes the dialog
     * follow them. Returns what the upload mutation needs for each, the caller starts them.
     */
    startSession: (values: AiModelUploadFormValues) => AiModelUploadVariables[];
    /** Forgets the batch the dialog was following so it starts empty again. Running uploads are NOT cancelled. */
    endSession: () => void;
    patchUpload: (id: string, patch: Partial<AiModelUploadItem>) => void;
    /** The upload started or a chunk was confirmed: updates the progress and the smoothed speed. */
    recordProgress: (id: string, uploadedBytes: number, progress: number) => void;
    /**
     * Puts the failed files back to queued at 0%, to be uploaded again from the start. Pass a batch id to
     * only take that batch. Returns what the upload mutation needs for each, and the failed attempts
     * that exist on the server, so they can be cancelled there.
     */
    prepareRetry: (batchId?: string) => AiModelUploadRetryPlan;
    /** The file of an upload is no longer needed once it reached the server. */
    releaseUploadFile: (id: string) => void;
    /**
     * Removes every batch whose files are all completed or failed. A cleared session starts over.
     * Returns the failed uploads that were removed and exist on the server, so they can be cancelled there.
     */
    clearFinishedUploads: () => AiModelUploadItem[];
  };
}

export const AI_MODEL_UPLOAD_EMPTY_DRAFT: AiModelUploadFormValues = { name: '', modelKey: '' };

/** The selected file of every upload that may still be sent (again), kept outside of the state. */
const uploadFiles = new Map<string, File>();

function createId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useAiModelUploadStore = create<AiModelUploadState>()((set, get) => {
  return {
    stagedFiles: [],
    draft: AI_MODEL_UPLOAD_EMPTY_DRAFT,
    sessionBatchId: null,
    uploads: [],

    actions: {
      setStagedFiles: (files: File[]) => {
        set({ stagedFiles: files });
      },

      setDraft: (draft: AiModelUploadFormValues) => {
        set({ draft: draft });
      },

      startSession: (values: AiModelUploadFormValues) => {
        const files: File[] = get().stagedFiles;
        if (files.length === 0) {
          return [];
        }
        const batchId: string = createId();
        const startedAt: number = Date.now();
        const items: AiModelUploadItem[] = files.map((file: File) => {
          return {
            id: createId(),
            batchId: batchId,
            name: values.name,
            modelKey: values.modelKey,
            fileName: file.name,
            size: file.size,
            status: AI_MODEL_UPLOAD_STATUS.queued,
            progress: 0,
            uploadedBytes: 0,
            bytesPerSecond: null,
            progressUpdatedAt: null,
            artifactId: null,
            error: null,
            startedAt: startedAt,
          };
        });
        items.forEach((item: AiModelUploadItem, index: number) => {
          uploadFiles.set(item.id, files[index]);
        });

        set((state: AiModelUploadState) => {
          return {
            stagedFiles: [],
            sessionBatchId: batchId,
            uploads: [...items, ...state.uploads],
          };
        });
        return items.map((item: AiModelUploadItem, index: number) => {
          return {
            uploadId: item.id,
            file: files[index],
            name: item.name,
            modelKey: item.modelKey,
          };
        });
      },

      endSession: () => {
        set({ sessionBatchId: null });
      },

      patchUpload: (id: string, patch: Partial<AiModelUploadItem>) => {
        set((state: AiModelUploadState) => {
          return {
            uploads: state.uploads.map((upload: AiModelUploadItem) => {
              return upload.id === id ? { ...upload, ...patch } : upload;
            }),
          };
        });
      },

      recordProgress: (id: string, uploadedBytes: number, progress: number) => {
        const now: number = Date.now();
        set((state: AiModelUploadState) => {
          return {
            uploads: state.uploads.map((upload: AiModelUploadItem) => {
              if (upload.id !== id) {
                return upload;
              }
              // the first report of a run only sets the starting point; a report with no new bytes (after a
              // failed chunk) restarts the clock, so the wait before a retry does not count as slow upload speed
              const bytesPerSecond: number | null =
                upload.progressUpdatedAt === null ?
                  upload.bytesPerSecond
                : getNextBytesPerSecond(upload.bytesPerSecond, uploadedBytes - upload.uploadedBytes, now - upload.progressUpdatedAt);
              return { ...upload, progress, uploadedBytes, bytesPerSecond, progressUpdatedAt: now };
            }),
          };
        });
      },

      prepareRetry: (batchId?: string) => {
        const retried: AiModelUploadVariables[] = [];
        const abandoned: AiModelUploadItem[] = [];
        set((state: AiModelUploadState) => {
          return {
            uploads: state.uploads.map((upload: AiModelUploadItem) => {
              const file: File | undefined = uploadFiles.get(upload.id);
              const isInScope: boolean = batchId === undefined || upload.batchId === batchId;
              if (upload.status !== AI_MODEL_UPLOAD_STATUS.failed || !isInScope || !file) {
                return upload;
              }
              // the retry starts over with a new POST, so the failed attempt is of no use on the server
              if (upload.artifactId !== null) {
                abandoned.push(upload);
              }
              retried.push({ uploadId: upload.id, file: file, name: upload.name, modelKey: upload.modelKey });
              return {
                ...upload,
                status: AI_MODEL_UPLOAD_STATUS.queued,
                error: null,
                progress: 0,
                uploadedBytes: 0,
                bytesPerSecond: null,
                progressUpdatedAt: null,
                artifactId: null,
              };
            }),
          };
        });
        return { uploads: retried, abandonedUploads: abandoned };
      },

      releaseUploadFile: (id: string) => {
        uploadFiles.delete(id);
      },

      clearFinishedUploads: () => {
        const { uploads, sessionBatchId } = get();
        // a batch is cleared as a whole once none of its files is running. A batch that is still going
        // keeps its finished files, so its outcome (e.g. a failed file) is not lost before it ends.
        const activeBatchIds = new Set<string>(uploads.filter(isAiModelUploadActive).map((upload: AiModelUploadItem) => {
          return upload.batchId;
        }));
        const keptUploads: AiModelUploadItem[] = uploads.filter((upload: AiModelUploadItem) => {
          return activeBatchIds.has(upload.batchId);
        });
        const removedUploads: AiModelUploadItem[] = uploads.filter((upload: AiModelUploadItem) => {
          return !activeBatchIds.has(upload.batchId);
        });
        removedUploads.forEach((upload: AiModelUploadItem) => {
          uploadFiles.delete(upload.id);
        });
        // the dialog's session was cleared away: start it over, instead of showing an empty batch as completed
        const isSessionCleared: boolean = sessionBatchId !== null && !activeBatchIds.has(sessionBatchId);
        set({ uploads: keptUploads, sessionBatchId: isSessionCleared ? null : sessionBatchId });
        // a failed upload can no longer be retried once it is cleared, so it is no use on the server either
        return removedUploads.filter((upload: AiModelUploadItem) => {
          return upload.status === AI_MODEL_UPLOAD_STATUS.failed && upload.artifactId !== null;
        });
      },
    },
  };
});

export const useAiModelUploadActions = () => {
  return useAiModelUploadStore((state: AiModelUploadState) => {
    return state.actions;
  });
};
export const useAiModelUploadStagedFiles = () => {
  return useAiModelUploadStore((state: AiModelUploadState) => {
    return state.stagedFiles;
  });
};
export const useAiModelUploadDraft = () => {
  return useAiModelUploadStore((state: AiModelUploadState) => {
    return state.draft;
  });
};
export const useAiModelUploads = () => {
  return useAiModelUploadStore((state: AiModelUploadState) => {
    return state.uploads;
  });
};
export const useAiModelUploadSessionBatchId = () => {
  return useAiModelUploadStore((state: AiModelUploadState) => {
    return state.sessionBatchId;
  });
};
export const useHasActiveAiModelUploads = () => {
  return useAiModelUploadStore((state: AiModelUploadState) => {
    return state.uploads.some(isAiModelUploadActive);
  });
};
