import { FILE_UPLOAD_PHASE, FILE_UPLOAD_STATUS } from './file-upload.constants';

export type FileUploadStatus = (typeof FILE_UPLOAD_STATUS)[keyof typeof FILE_UPLOAD_STATUS];

export type FileUploadPhase = (typeof FILE_UPLOAD_PHASE)[keyof typeof FILE_UPLOAD_PHASE];

/** Extra data sent along with every file, FilePond posts it as a JSON string under the same field name as the file. */
export type FileUploadMetadata = Record<string, unknown>;

/**
 * Where and how files are uploaded. Mirrors FilePond's own `server` + chunk options
 * (https://pqina.nl/filepond/docs/api/server/), so a real FilePond backend drops in by changing `url`.
 *
 * With `url: '/api/filepond-mock'` the requests are:
 *
 * | stage              | request                                                                            |
 * | ------------------ | ---------------------------------------------------------------------------------- |
 * | process            | `POST   /api/filepond-mock`  multipart: `filepond`=metadata JSON, `filepond`=file   |
 * | process (chunked)  | `POST   /api/filepond-mock`  multipart: metadata only, header `Upload-Length`       |
 * | send chunk         | `PATCH  /api/filepond-mock?patch=<id>`  headers `Upload-Offset/Length/Name`         |
 * | resume chunks      | `HEAD   /api/filepond-mock?patch=<id>`  responds with header `Upload-Offset`        |
 * | revert             | `DELETE /api/filepond-mock`  body: `<id>`                                           |
 *
 * `process` responds with the unique server id of the file as `text/plain`.
 */
export interface FileUploadServerConfig {
  /** Base url of the FilePond endpoint, e.g. `/api/filepond-mock`. */
  url: string;
  /** Path appended to `url` for the process (upload) request. Defaults to `''` like FilePond's string config. */
  processPath?: string;
  /** Path appended to `url` for chunk requests, the transfer id is appended to it. Defaults to `'?patch='`. */
  patchPath?: string;
  /** Form field name. Defaults to `filepond`. */
  fieldName?: string;
  /** Extra request headers, e.g. an auth token. */
  headers?: Record<string, string>;
  /** Send cookies on cross origin requests. */
  withCredentials?: boolean;
  /** FilePond `chunkUploads`: upload in chunks so progress is confirmed by the server (resuming is not implemented yet). */
  chunkUploads?: boolean;
  /** FilePond `chunkForce`: also chunk files that are smaller than the chunk size. */
  chunkForce?: boolean;
  /** FilePond `chunkSize` in bytes. A function lets the caller size chunks per file. Defaults to 5MB. */
  chunkSize?: number | ((file: File) => number);
  /** FilePond `maxParallelUploads`. Defaults to 2. */
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
