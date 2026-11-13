import { FILE_UPLOAD_DEFAULT_CHUNK_SIZE, FILE_UPLOAD_DEFAULT_FIELD_NAME } from './file-upload.constants';

import type { FileUploadMetadata, FileUploadServerConfig } from './file-upload.models';

/**
 * Uploads one file to a FilePond server endpoint, speaking the same protocol FilePond's own
 * `server` option does (https://pqina.nl/filepond/docs/api/server/).
 *
 * Why not let the <FilePond> component process the file itself: FilePond aborts every running
 * upload when its component unmounts, and the upload surface (a dialog) unmounts when it closes.
 * Uploads have to outlive the dialog, so they are driven from the upload store through this module.
 *
 * Given `config.url = '/api/filepond-mock'`:
 *
 * 1. Regular upload (`chunkUploads` off)
 *    - `POST /api/filepond-mock`
 *      body `multipart/form-data` with the field `filepond` twice: first the metadata as a JSON
 *      string, then the file. Responds `text/plain` with the unique server id of the file.
 *
 * 2. Chunked upload (`chunkUploads` on, and the file is bigger than the chunk size or `chunkForce`)
 *    - `POST /api/filepond-mock`
 *      body `multipart/form-data` with only the metadata under `filepond` (no file), header
 *      `Upload-Length: <file size>`. Responds `text/plain` with the transfer id.
 *    - `PATCH /api/filepond-mock?patch=<id>` once per chunk
 *      body is the raw chunk, headers `Content-Type: application/offset+octet-stream`,
 *      `Upload-Offset: <offset of the chunk>`, `Upload-Length: <file size>`, `Upload-Name: <file name>`.
 *    - `HEAD /api/filepond-mock?patch=<id>` (resume, not used here yet)
 *      responds with the header `Upload-Offset: <next expected offset>`.
 *
 * 3. Revert, removes an uploaded file again
 *    - `DELETE /api/filepond-mock` with the server id as the plain text body.
 *
 * The other FilePond endpoints are not needed for uploading: `GET ?load=<id>`, `GET ?restore=<id>`
 * and `GET ?fetch=<url>`.
 */

interface UploadFileOptions {
  file: File;
  config: FileUploadServerConfig;
  metadata?: FileUploadMetadata;
  /** Called with 0 to 100. */
  onProgress?: (progress: number) => void;
}

interface SendRequestOptions {
  method: 'POST' | 'PATCH' | 'DELETE';
  url: string;
  body: XMLHttpRequestBodyInit;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  /** Called with the bytes of the body that were sent so far. */
  onUploadProgress?: (loaded: number) => void;
}

function sendRequest({ method, url, body, headers, withCredentials, onUploadProgress }: SendRequestOptions): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.withCredentials = withCredentials ?? false;
    Object.entries(headers ?? {}).forEach(([name, value]: [string, string]) => {
      xhr.setRequestHeader(name, value);
    });
    if (onUploadProgress) {
      xhr.upload.onprogress = (event: ProgressEvent) => {
        onUploadProgress(event.loaded);
      };
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
        return;
      }
      reject(new Error(xhr.responseText || xhr.statusText || `Request failed with status ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.ontimeout = () => reject(new Error('Request timed out'));
    xhr.send(body);
  });
}

function getProcessUrl(config: FileUploadServerConfig): string {
  return `${config.url}${config.processPath ?? ''}`;
}

function getPatchUrl(config: FileUploadServerConfig, transferId: string): string {
  return `${config.url}${config.patchPath ?? '?patch='}${encodeURIComponent(transferId)}`;
}

function getChunkSize(file: File, config: FileUploadServerConfig): number {
  const chunkSize: number =
    typeof config.chunkSize === 'function' ? config.chunkSize(file) : (config.chunkSize ?? FILE_UPLOAD_DEFAULT_CHUNK_SIZE);
  return Math.max(1, Math.floor(chunkSize));
}

/**
 * FilePond sends the raw file name. A header value has to be ISO-8859-1 though, so a name with
 * characters outside of it (which FilePond itself cannot send) is percent-encoded instead.
 */
function getUploadNameHeader(fileName: string): string {
  const isHeaderSafe: boolean = /^[\x20-\x7E\xA0-\xFF]*$/.test(fileName);
  return isHeaderSafe ? fileName : encodeURIComponent(fileName);
}

function appendMetadata(formData: FormData, fieldName: string, metadata?: FileUploadMetadata): void {
  if (metadata) {
    formData.append(fieldName, JSON.stringify(metadata));
  }
}

async function uploadFileInOneRequest({ file, config, metadata, onProgress }: UploadFileOptions): Promise<string> {
  const fieldName: string = config.fieldName ?? FILE_UPLOAD_DEFAULT_FIELD_NAME;
  const formData = new FormData();
  appendMetadata(formData, fieldName, metadata);
  formData.append(fieldName, file, file.name);

  const serverId: string = await sendRequest({
    method: 'POST',
    url: getProcessUrl(config),
    body: formData,
    headers: config.headers,
    withCredentials: config.withCredentials,
    onUploadProgress: (loaded: number) => {
      // the body carries a little multipart overhead, so cap below 100 until the server has answered
      onProgress?.(file.size === 0 ? 99 : Math.min(99, (loaded / file.size) * 100));
    },
  });
  onProgress?.(100);
  return serverId;
}

async function uploadFileInChunks({ file, config, metadata, onProgress }: UploadFileOptions): Promise<string> {
  const fieldName: string = config.fieldName ?? FILE_UPLOAD_DEFAULT_FIELD_NAME;
  const chunkSize: number = getChunkSize(file, config);

  const formData = new FormData();
  appendMetadata(formData, fieldName, metadata);
  const transferId: string = await sendRequest({
    method: 'POST',
    url: getProcessUrl(config),
    body: formData,
    headers: { ...config.headers, 'Upload-Length': String(file.size) },
    withCredentials: config.withCredentials,
  });

  // same slicing as FilePond: an empty file still sends one (empty) chunk
  const lastChunkIndex: number = Math.max(0, Math.ceil(file.size / chunkSize) - 1);
  for (let index = 0; index <= lastChunkIndex; index++) {
    const offset: number = index * chunkSize;
    const chunk: Blob = file.slice(offset, offset + chunkSize, 'application/offset+octet-stream');
    await sendRequest({
      method: 'PATCH',
      url: getPatchUrl(config, transferId),
      body: chunk,
      headers: {
        ...config.headers,
        'Content-Type': 'application/offset+octet-stream',
        'Upload-Offset': String(offset),
        'Upload-Length': String(file.size),
        'Upload-Name': getUploadNameHeader(file.name),
      },
      withCredentials: config.withCredentials,
    });
    // a chunk only counts once the server has confirmed it
    onProgress?.(file.size === 0 ? 100 : (Math.min(file.size, offset + chunk.size) / file.size) * 100);
  }
  return transferId;
}

/** Uploads one file and resolves with the unique id the server stored it under. */
export function uploadFile(options: UploadFileOptions): Promise<string> {
  const { file, config } = options;
  const shouldChunk: boolean = !!config.chunkUploads && (!!config.chunkForce || file.size > getChunkSize(file, config));
  return shouldChunk ? uploadFileInChunks(options) : uploadFileInOneRequest(options);
}

/** FilePond "revert": asks the server to remove a file it has stored under `serverId`. */
export function revertUploadedFile(serverId: string, config: FileUploadServerConfig): Promise<string> {
  return sendRequest({
    method: 'DELETE',
    url: getProcessUrl(config),
    body: serverId,
    headers: config.headers,
    withCredentials: config.withCredentials,
  });
}
