import { create } from 'zustand';

import { uploadFile } from './file-upload.uploader';
import { clampProgress, isFileUploadActive } from './file-upload.utils';
import { FILE_UPLOAD_STATUS, FILE_UPLOAD_DEFAULT_MAX_PARALLEL_UPLOADS } from './file-upload.constants';

import type { FileUploadItem, FileUploadMetadata, FileUploadServerConfig } from './file-upload.models';

/**
 * Global upload state. It lives outside of React on purpose: the upload surface (a dialog) can be
 * closed and unmounted while uploads keep running, and any other part of the app (the notifications
 * popover) can display their progress.
 *
 * - `stagedFiles`     files picked in the drop zone that were not sent yet, kept so they survive the dialog closing
 * - `sessionBatchId`  the batch the upload surface is currently following, null while still staging
 * - `uploads`         every file that was sent or is being sent, newest batch first
 */
interface FileUploadState {
  stagedFiles: File[];
  sessionBatchId: string | null;
  uploads: FileUploadItem[];

  actions: {
    setStagedFiles: (files: File[]) => void;
    /** Sends every staged file. The staged files become a batch and the session starts following it. */
    startUpload: (config: FileUploadServerConfig, metadata?: FileUploadMetadata) => void;
    /** Forgets the batch the surface was following so it starts empty again. Running uploads are NOT cancelled. */
    endSession: () => void;
    /** Sends the failed files again, from the start. Pass a batch id to only retry the files of that batch. */
    retryFailedUploads: (batchId?: string) => void;
    /** Removes every batch whose files are all completed or failed. A cleared session starts over. */
    clearFinishedUploads: () => void;
  };
}

interface QueuedUpload {
  id: string;
  batchId: string;
  file: File;
  config: FileUploadServerConfig;
  metadata?: FileUploadMetadata;
}

const queuedUploads: QueuedUpload[] = [];
/** What is needed to send a file again, kept (outside of the state) until the file is completed or cleared. */
const uploadSources = new Map<string, QueuedUpload>();
/** Running uploads per batch: `maxParallelUploads` applies to each batch, like it does to each FilePond instance. */
const runningCountByBatchId = new Map<string, number>();

function createId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function patchUpload(id: string, patch: Partial<FileUploadItem>): void {
  useFileUploadStore.setState((state: FileUploadState) => ({
    uploads: state.uploads.map((upload: FileUploadItem) => (upload.id === id ? { ...upload, ...patch } : upload)),
  }));
}

function changeRunningCount(batchId: string, delta: number): void {
  const count: number = (runningCountByBatchId.get(batchId) ?? 0) + delta;
  if (count <= 0) {
    runningCountByBatchId.delete(batchId);
  } else {
    runningCountByBatchId.set(batchId, count);
  }
}

function hasFreeSlot(queued: QueuedUpload): boolean {
  const configured: number = queued.config.maxParallelUploads ?? FILE_UPLOAD_DEFAULT_MAX_PARALLEL_UPLOADS;
  // NaN or Infinity would make the comparison below always false and leave the batch queued forever
  const maxParallelUploads: number = Number.isFinite(configured) ? Math.max(1, Math.floor(configured)) : FILE_UPLOAD_DEFAULT_MAX_PARALLEL_UPLOADS;
  return (runningCountByBatchId.get(queued.batchId) ?? 0) < maxParallelUploads;
}

function startQueuedUpload(next: QueuedUpload): void {
  changeRunningCount(next.batchId, 1);
  patchUpload(next.id, { status: FILE_UPLOAD_STATUS.uploading });
  // started inside a promise so that an error thrown synchronously (e.g. by a `chunkSize` callback)
  // still lands in catch/finally and frees the slot, instead of wedging the queue
  Promise.resolve()
    .then(() =>
      uploadFile({
        file: next.file,
        config: next.config,
        metadata: next.metadata,
        onProgress: (progress: number) => patchUpload(next.id, { progress: clampProgress(progress) }),
      }),
    )
    .then((serverId: string) => {
      uploadSources.delete(next.id);
      patchUpload(next.id, { status: FILE_UPLOAD_STATUS.completed, progress: 100, serverId: serverId });
    })
    .catch((error: unknown) => {
      patchUpload(next.id, { status: FILE_UPLOAD_STATUS.failed, error: error instanceof Error ? error.message : 'Upload failed' });
    })
    .finally(() => {
      changeRunningCount(next.batchId, -1);
      runQueuedUploads();
    });
}

/** Starts every queued file whose batch has a free slot, oldest first. */
function runQueuedUploads(): void {
  let index = 0;
  while (index < queuedUploads.length) {
    const queued: QueuedUpload = queuedUploads[index];
    if (!hasFreeSlot(queued)) {
      index++;
      continue;
    }
    queuedUploads.splice(index, 1);
    startQueuedUpload(queued);
  }
}

export const useFileUploadStore = create<FileUploadState>()((set, get) => ({
  stagedFiles: [],
  sessionBatchId: null,
  uploads: [],

  actions: {
    setStagedFiles: (files: File[]) => {
      set({ stagedFiles: files });
    },

    startUpload: (config: FileUploadServerConfig, metadata?: FileUploadMetadata) => {
      const files: File[] = get().stagedFiles;
      if (files.length === 0) {
        return;
      }
      const batchId: string = createId();
      const startedAt: number = Date.now();
      const items: FileUploadItem[] = files.map((file: File) => ({
        id: createId(),
        batchId: batchId,
        name: file.name,
        size: file.size,
        status: FILE_UPLOAD_STATUS.queued,
        progress: 0,
        serverId: null,
        error: null,
        startedAt: startedAt,
      }));

      set((state: FileUploadState) => ({
        stagedFiles: [],
        sessionBatchId: batchId,
        uploads: [...items, ...state.uploads],
      }));

      items.forEach((item: FileUploadItem, index: number) => {
        const source: QueuedUpload = { id: item.id, batchId: batchId, file: files[index], config: config, metadata: metadata };
        uploadSources.set(item.id, source);
        queuedUploads.push(source);
      });
      runQueuedUploads();
    },

    endSession: () => {
      set({ sessionBatchId: null });
    },

    retryFailedUploads: (batchId?: string) => {
      const retried: QueuedUpload[] = [];
      set((state: FileUploadState) => ({
        uploads: state.uploads.map((upload: FileUploadItem) => {
          const source: QueuedUpload | undefined = uploadSources.get(upload.id);
          const isInScope: boolean = batchId === undefined || upload.batchId === batchId;
          if (upload.status !== FILE_UPLOAD_STATUS.failed || !isInScope || !source) {
            return upload;
          }
          retried.push(source);
          return { ...upload, status: FILE_UPLOAD_STATUS.queued, progress: 0, error: null };
        }),
      }));
      queuedUploads.push(...retried);
      runQueuedUploads();
    },

    clearFinishedUploads: () => {
      set((state: FileUploadState) => {
        // a batch is cleared as a whole once none of its files is running. A batch that is still going
        // keeps its finished files, so its outcome (e.g. a failed file) is not lost before it ends.
        const activeBatchIds = new Set<string>(state.uploads.filter(isFileUploadActive).map((upload: FileUploadItem) => upload.batchId));
        const keptUploads: FileUploadItem[] = state.uploads.filter((upload: FileUploadItem) => activeBatchIds.has(upload.batchId));
        state.uploads.forEach((upload: FileUploadItem) => {
          if (!activeBatchIds.has(upload.batchId)) {
            uploadSources.delete(upload.id);
          }
        });
        // the surface's session was cleared away: start it over, instead of showing an empty batch as completed
        const isSessionCleared: boolean = state.sessionBatchId !== null && !activeBatchIds.has(state.sessionBatchId);
        return { uploads: keptUploads, sessionBatchId: isSessionCleared ? null : state.sessionBatchId };
      });
    },
  },
}));

export const useFileUploadActions = () => useFileUploadStore((state: FileUploadState) => state.actions);
export const useStagedFiles = () => useFileUploadStore((state: FileUploadState) => state.stagedFiles);
export const useFileUploads = () => useFileUploadStore((state: FileUploadState) => state.uploads);
export const useFileUploadSessionBatchId = () => useFileUploadStore((state: FileUploadState) => state.sessionBatchId);
export const useHasActiveFileUploads = () => useFileUploadStore((state: FileUploadState) => state.uploads.some(isFileUploadActive));
