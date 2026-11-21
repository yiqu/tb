import { FILE_UPLOAD_PHASE, FILE_UPLOAD_STATUS, FILE_UPLOAD_PROCESS_BODY_FORMAT } from './file-upload.constants';

export type FileUploadStatus = (typeof FILE_UPLOAD_STATUS)[keyof typeof FILE_UPLOAD_STATUS];

export type FileUploadPhase = (typeof FILE_UPLOAD_PHASE)[keyof typeof FILE_UPLOAD_PHASE];

export type FileUploadProcessBodyFormat = (typeof FILE_UPLOAD_PROCESS_BODY_FORMAT)[keyof typeof FILE_UPLOAD_PROCESS_BODY_FORMAT];

/** A value that survives `JSON.stringify` unchanged. */
export type FileUploadMetadataValue = string | number | boolean | null | FileUploadMetadataValue[] | FileUploadMetadata;

/** Extra data sent along with every file, FilePond posts it as a JSON string under the same field name as the file. */
export interface FileUploadMetadata {
  [key: string]: FileUploadMetadataValue;
}

/**
 * Where and how files are uploaded. Mirrors FilePond's own `server` + chunk options
 * (https://pqina.nl/filepond/docs/api/server/), so a real FilePond backend drops in by changing `url`.
 *
 * With FilePond's defaults and `url: '/api/files'` the requests are (see the README for the AI model API variant):
 *
 * | stage              | request                                                                            |
 * | ------------------ | ---------------------------------------------------------------------------------- |
 * | process            | `POST   /api/files`  multipart: `filepond`=metadata JSON, `filepond`=file   |
 * | process (chunked)  | `POST   /api/files`  multipart: metadata only, header `Upload-Length`       |
 * | send chunk         | `PATCH  /api/files?patch=<id>`  headers `Upload-Offset/Length/Name`         |
 * | resume chunks      | `HEAD   /api/files?patch=<id>`  responds with header `Upload-Offset`        |
 * | revert             | `DELETE /api/files`  body: `<id>`                                           |
 *
 * `process` responds with the unique server id of the file as `text/plain`.
 */
export interface FileUploadServerConfig {
  /** Base url of the upload endpoint, e.g. `/api/ai-models/multipart-upload`. */
  url: string;
  /** Path appended to `url` for the process (upload) request. Defaults to `''` like FilePond's string config. */
  processPath?: string;
  /** Path appended to `url` for chunk requests, the transfer id is appended to it. Defaults to `'?patch='`. */
  patchPath?: string;
  /** Path appended to `url` for the revert (DELETE) request. Defaults to `''` like FilePond's string config. */
  revertPath?: string;
  /**
   * Not part of FilePond. When set, a chunked upload that fails for good is cancelled on the server with
   * `DELETE <url><cancelPath><transfer id>` and the header `Upload-Length`, so it does not linger half done.
   * E.g. `'/'` for `DELETE /api/ai-models/multipart-upload/<id>`.
   */
  cancelPath?: string;
  /**
   * How the metadata is sent in the first `POST` of a chunked upload. `multipart` (default) is FilePond's
   * way, `json` sends the metadata object as an `application/json` body. `json` cannot carry a file, so
   * with it every file is chunked, whatever `chunkUploads` and `chunkForce` say.
   */
  processBodyFormat?: FileUploadProcessBodyFormat;
  /** Form field name. Defaults to `filepond`. */
  fieldName?: string;
  /** Extra request headers, e.g. an auth token. */
  headers?: Record<string, string>;
  /** Send cookies on cross origin requests. */
  withCredentials?: boolean;
  /**
   * A request fails when it made no progress (nothing sent, no answer) for this many ms. It restarts
   * on every progress event, so a large file that is still moving is not cut off. `0` waits forever.
   * Defaults to 60 seconds.
   */
  timeout?: number;
  /**
   * FilePond `chunkUploads`: upload in chunks so progress is confirmed by the server. A failed chunk
   * is retried after `chunkRetryDelays`, resuming from the offset the server reports with `HEAD`.
   */
  chunkUploads?: boolean;
  /** FilePond `chunkForce`: also chunk files that are smaller than the chunk size. */
  chunkForce?: boolean;
  /** FilePond `chunkSize` in bytes. A function lets the caller size chunks per file. Defaults to 5MB. */
  chunkSize?: number | ((file: File) => number);
  /** FilePond `chunkRetryDelays`: ms to wait before each retry of a failed chunk. Defaults to `[500, 1000, 3000]`, `[]` disables retries. */
  chunkRetryDelays?: readonly number[];
  /** FilePond `maxParallelUploads`: how many files of one batch upload at the same time. Defaults to 2. */
  maxParallelUploads?: number;
}

/** One file that the user asked to upload. */
export interface FileUploadItem {
  id: string;
  /** Files started with the same press of Upload share a batch id. */
  batchId: string;
  name: string;
  size: number;
  status: FileUploadStatus;
  /** 0 to 100. */
  progress: number;
  /** The unique id the server answered with, set once the file is completed. */
  serverId: string | null;
  error: string | null;
  startedAt: number;
}
