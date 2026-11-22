import { create } from 'zustand';

import { isPwsModelUploadActive, getNextBytesPerSecond } from '../utils/pws-model-upload.utils';
import { PWS_MODEL_UPLOAD_STATUS } from '../constants/pws-model-upload.constants';

import type { PwsModelUploadFormValues } from '../schemas/pws-model-upload.schema';
import type { PwsModelUploadItem, PwsModelUploadVariables, PwsModelUploadRetryPlan } from '../models/pws-model-upload.models';

/**
 * Global upload state. It lives outside of React on purpose: the dialog can be closed and unmounted
 * while uploads keep running, and other parts of the app (the notifications popover, the tab title)
 * show their progress. The requests themselves run in TanStack Query mutations
 * (`usePwsModelUploadMutation`), which write their progress here.
 *
 * - `stagedFiles`     files picked in the drop zone that were not sent yet, kept so they survive the dialog closing
 * - `draft`           the name and model key typed in the form, kept for the same reason
 * - `sessionBatchId`  the batch the dialog is currently showing, null while still staging
 * - `uploads`         every file that was sent or is being sent, newest batch first
 */
interface PwsModelUploadState {
  stagedFiles: File[];
  draft: PwsModelUploadFormValues;
  sessionBatchId: string | null;
  uploads: PwsModelUploadItem[];

  actions: {
    setStagedFiles: (files: File[]) => void;
    setDraft: (draft: PwsModelUploadFormValues) => void;
    /**
     * Turns every staged file into an upload with the given name and model key, and makes the dialog
     * follow them. Returns what the upload mutation needs for each, the caller starts them.
     */
    startSession: (values: PwsModelUploadFormValues) => PwsModelUploadVariables[];
    /** Forgets the batch the dialog was following so it starts empty again. Running uploads are NOT cancelled. */
    endSession: () => void;
    patchUpload: (id: string, patch: Partial<PwsModelUploadItem>) => void;
    /** The upload started or a chunk was confirmed: updates the progress and the smoothed speed. */
    recordProgress: (id: string, uploadedBytes: number, progress: number) => void;
    /**
     * Puts the failed files back to queued at 0%, to be uploaded again from the start. Pass a batch id to
     * only take that batch. Returns what the upload mutation needs for each, and the failed attempts
     * that exist on the server, so they can be cancelled there.
     */
    prepareRetry: (batchId?: string) => PwsModelUploadRetryPlan;
    /** The file of an upload is no longer needed once it reached the server. */
    releaseUploadFile: (id: string) => void;
    /**
     * Removes every batch whose files are all completed or failed. A cleared session starts over.
     * Returns the failed uploads that were removed and exist on the server, so they can be cancelled there.
     */
    clearFinishedUploads: () => PwsModelUploadItem[];
  };
}

export const PWS_MODEL_UPLOAD_EMPTY_DRAFT: PwsModelUploadFormValues = { name: '', modelKey: '' };

/** The selected file of every upload that may still be sent (again), kept outside of the state. */
const uploadFiles = new Map<string, File>();

function createId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const usePwsModelUploadStore = create<PwsModelUploadState>()((set, get) => {
  return {
    stagedFiles: [],
    draft: PWS_MODEL_UPLOAD_EMPTY_DRAFT,
    sessionBatchId: null,
    uploads: [],

    actions: {
      setStagedFiles: (files: File[]) => {
        set({ stagedFiles: files });
      },

      setDraft: (draft: PwsModelUploadFormValues) => {
        set({ draft: draft });
      },

      startSession: (values: PwsModelUploadFormValues) => {
        const files: File[] = get().stagedFiles;
        if (files.length === 0) {
          return [];
        }
        const batchId: string = createId();
        const startedAt: number = Date.now();
        const items: PwsModelUploadItem[] = files.map((file: File) => {
          return {
            id: createId(),
            batchId: batchId,
            name: values.name,
            modelKey: values.modelKey,
            fileName: file.name,
            size: file.size,
            status: PWS_MODEL_UPLOAD_STATUS.queued,
            progress: 0,
            uploadedBytes: 0,
            bytesPerSecond: null,
            progressUpdatedAt: null,
            artifactId: null,
            error: null,
            startedAt: startedAt,
          };
        });
        items.forEach((item: PwsModelUploadItem, index: number) => {
          uploadFiles.set(item.id, files[index]);
        });

        set((state: PwsModelUploadState) => {
          return {
            stagedFiles: [],
            sessionBatchId: batchId,
            uploads: [...items, ...state.uploads],
          };
        });
        return items.map((item: PwsModelUploadItem, index: number) => {
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

      patchUpload: (id: string, patch: Partial<PwsModelUploadItem>) => {
        set((state: PwsModelUploadState) => {
          return {
            uploads: state.uploads.map((upload: PwsModelUploadItem) => {
              return upload.id === id ? { ...upload, ...patch } : upload;
            }),
          };
        });
      },

      recordProgress: (id: string, uploadedBytes: number, progress: number) => {
        const now: number = Date.now();
        set((state: PwsModelUploadState) => {
          return {
            uploads: state.uploads.map((upload: PwsModelUploadItem) => {
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
        const retried: PwsModelUploadVariables[] = [];
        const abandoned: PwsModelUploadItem[] = [];
        set((state: PwsModelUploadState) => {
          return {
            uploads: state.uploads.map((upload: PwsModelUploadItem) => {
              const file: File | undefined = uploadFiles.get(upload.id);
              const isInScope: boolean = batchId === undefined || upload.batchId === batchId;
              if (upload.status !== PWS_MODEL_UPLOAD_STATUS.failed || !isInScope || !file) {
                return upload;
              }
              // the retry starts over with a new POST, so the failed attempt is of no use on the server
              if (upload.artifactId !== null) {
                abandoned.push(upload);
              }
              retried.push({ uploadId: upload.id, file: file, name: upload.name, modelKey: upload.modelKey });
              return {
                ...upload,
                status: PWS_MODEL_UPLOAD_STATUS.queued,
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
        const activeBatchIds = new Set<string>(uploads.filter(isPwsModelUploadActive).map((upload: PwsModelUploadItem) => {
          return upload.batchId;
        }));
        const keptUploads: PwsModelUploadItem[] = uploads.filter((upload: PwsModelUploadItem) => {
          return activeBatchIds.has(upload.batchId);
        });
        const removedUploads: PwsModelUploadItem[] = uploads.filter((upload: PwsModelUploadItem) => {
          return !activeBatchIds.has(upload.batchId);
        });
        removedUploads.forEach((upload: PwsModelUploadItem) => {
          uploadFiles.delete(upload.id);
        });
        // the dialog's session was cleared away: start it over, instead of showing an empty batch as completed
        const isSessionCleared: boolean = sessionBatchId !== null && !activeBatchIds.has(sessionBatchId);
        set({ uploads: keptUploads, sessionBatchId: isSessionCleared ? null : sessionBatchId });
        // a failed upload can no longer be retried once it is cleared, so it is no use on the server either
        return removedUploads.filter((upload: PwsModelUploadItem) => {
          return upload.status === PWS_MODEL_UPLOAD_STATUS.failed && upload.artifactId !== null;
        });
      },
    },
  };
});

export const usePwsModelUploadActions = () => {
  return usePwsModelUploadStore((state: PwsModelUploadState) => {
    return state.actions;
  });
};
export const usePwsModelUploadStagedFiles = () => {
  return usePwsModelUploadStore((state: PwsModelUploadState) => {
    return state.stagedFiles;
  });
};
export const usePwsModelUploadDraft = () => {
  return usePwsModelUploadStore((state: PwsModelUploadState) => {
    return state.draft;
  });
};
export const usePwsModelUploads = () => {
  return usePwsModelUploadStore((state: PwsModelUploadState) => {
    return state.uploads;
  });
};
export const usePwsModelUploadSessionBatchId = () => {
  return usePwsModelUploadStore((state: PwsModelUploadState) => {
    return state.sessionBatchId;
  });
};
export const useHasActivePwsModelUploads = () => {
  return usePwsModelUploadStore((state: PwsModelUploadState) => {
    return state.uploads.some(isPwsModelUploadActive);
  });
};
