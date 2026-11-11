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
    /** Removes the uploads that are completed or failed from the list. */
    clearFinishedUploads: () => void;
  };
}

interface QueuedUpload {
  id: string;
  file: File;
  config: FileUploadServerConfig;
  metadata?: FileUploadMetadata;
}

const queuedUploads: QueuedUpload[] = [];
let runningUploadCount = 0;

function createId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function patchUpload(id: string, patch: Partial<FileUploadItem>): void {
  useFileUploadStore.setState((state: FileUploadState) => ({
    uploads: state.uploads.map((upload: FileUploadItem) => (upload.id === id ? { ...upload, ...patch } : upload)),
  }));
}

function runQueuedUploads(): void {
  while (queuedUploads.length > 0) {
    const maxParallelUploads: number = Math.max(1, queuedUploads[0].config.maxParallelUploads ?? FILE_UPLOAD_DEFAULT_MAX_PARALLEL_UPLOADS);
    if (runningUploadCount >= maxParallelUploads) {
      return;
    }
    const next: QueuedUpload | undefined = queuedUploads.shift();
    if (!next) {
      return;
    }
    runningUploadCount++;
    patchUpload(next.id, { status: FILE_UPLOAD_STATUS.uploading });
    uploadFile({
      file: next.file,
      config: next.config,
      metadata: next.metadata,
      onProgress: (progress: number) => patchUpload(next.id, { progress: clampProgress(progress) }),
    })
      .then((serverId: string) => {
        patchUpload(next.id, { status: FILE_UPLOAD_STATUS.completed, progress: 100, serverId: serverId });
      })
      .catch((error: unknown) => {
        patchUpload(next.id, { status: FILE_UPLOAD_STATUS.failed, error: error instanceof Error ? error.message : 'Upload failed' });
      })
      .finally(() => {
        runningUploadCount--;
        runQueuedUploads();
      });
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
        queuedUploads.push({ id: item.id, file: files[index], config: config, metadata: metadata });
      });
      runQueuedUploads();
    },

    endSession: () => {
      set({ sessionBatchId: null });
    },

    clearFinishedUploads: () => {
      set((state: FileUploadState) => ({ uploads: state.uploads.filter(isFileUploadActive) }));
    },
  },
}));

export const useFileUploadActions = () => useFileUploadStore((state: FileUploadState) => state.actions);
export const useStagedFiles = () => useFileUploadStore((state: FileUploadState) => state.stagedFiles);
export const useFileUploads = () => useFileUploadStore((state: FileUploadState) => state.uploads);
export const useFileUploadSessionBatchId = () => useFileUploadStore((state: FileUploadState) => state.sessionBatchId);
export const useHasActiveFileUploads = () => useFileUploadStore((state: FileUploadState) => state.uploads.some(isFileUploadActive));
