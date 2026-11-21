import {
  FILE_UPLOAD_DEFAULT_TIMEOUT_MS,
  FILE_UPLOAD_DEFAULT_CHUNK_SIZE,
  FILE_UPLOAD_DEFAULT_FIELD_NAME,
  FILE_UPLOAD_DEFAULT_CHUNK_RETRY_DELAYS,
  FILE_UPLOAD_PROCESS_BODY_FORMAT,
} from './file-upload.constants';

import type { FileUploadMetadata, FileUploadServerConfig } from './file-upload.models';

/**
 * Uploads one file to a FilePond server endpoint, speaking the same protocol FilePond's own
 * `server` option does (https://pqina.nl/filepond/docs/api/server/).
 *
 * Why not let the <FilePond> component process the file itself: FilePond aborts every running
 * upload when its component unmounts, and the upload surface (a dialog) unmounts when it closes.
 * Uploads have to outlive the dialog, so they are driven from the upload store through this module.
 *
 * Given `config.url = '/api/files'`:
 *
 * 1. Regular upload (`chunkUploads` off)
 *    - `POST /api/files`
 *      body `multipart/form-data` with the field `filepond` twice: first the metadata as a JSON
 *      string, then the file. Responds `text/plain` with the unique server id of the file.
 *
 * 2. Chunked upload (`chunkUploads` on, and the file is bigger than the chunk size or `chunkForce`)
 *    - `POST /api/files`
 *      body `multipart/form-data` with only the metadata under `filepond` (no file), header
 *      `Upload-Length: <file size>`. Responds `text/plain` with the transfer id.
 *    - `PATCH /api/files?patch=<id>` once per chunk
 *      body is the raw chunk, headers `Content-Type: application/offset+octet-stream`,
 *      `Upload-Offset: <offset of the chunk>`, `Upload-Length: <file size>`,
 *      `Upload-Name: <percent-encoded file name>`.
 *    - `HEAD /api/files?patch=<id>` when a chunk failed, before it is retried
 *      responds with the header `Upload-Offset: <next expected offset>`, the upload resumes from there.
 *
 * 3. Revert, removes an uploaded file again
 *    - `DELETE /api/files` with the server id as the plain text body.
 *
 * Two options go beyond FilePond, for backends like the AI model API (see the README):
 * - `processBodyFormat: 'json'` sends the metadata of the first chunked `POST` as an `application/json`
 *   body instead of `multipart/form-data`, and always chunks.
 * - `cancelPath` sends `DELETE <url><cancelPath><id>` with `Upload-Length` when a chunked upload fails for good.
 *
 * `HEAD` also carries `Upload-Length`, which FilePond does not send but which such backends require.
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
  method: 'POST' | 'PATCH' | 'HEAD' | 'DELETE';
  url: string;
  body?: XMLHttpRequestBodyInit;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  /** Fails the request when nothing happened (no upload progress, no response) for this long. 0 waits forever. */
  timeout?: number;
  /** Called with the bytes of the body that were sent so far. */
  onUploadProgress?: (loaded: number) => void;
}

interface SendRequestResult {
  text: string;
  getHeader: (name: string) => string | null;
}

function sendRequest({ method, url, body, headers, withCredentials, timeout, onUploadProgress }: SendRequestOptions): Promise<SendRequestResult> {
  return new Promise<SendRequestResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    // only an explicit 0 turns the stall timer off, anything else invalid falls back to the default
    const timeoutMs: number = timeout === undefined || !Number.isFinite(timeout) || timeout < 0 ? FILE_UPLOAD_DEFAULT_TIMEOUT_MS : timeout;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    // `xhr.timeout` limits the whole request, which would also cut off a large file that is still
    // moving. This timer only fires when the request stalls: every progress event restarts it.
    const restartTimeout = () => {
      clearTimeout(timeoutId);
      if (timeoutMs > 0) {
        timeoutId = setTimeout(() => {
          xhr.abort();
          reject(new Error('Request timed out'));
        }, timeoutMs);
      }
    };

    xhr.open(method, url, true);
    xhr.withCredentials = withCredentials ?? false;
    Object.entries(headers ?? {}).forEach(([name, value]: [string, string]) => {
      xhr.setRequestHeader(name, value);
    });
    xhr.upload.onprogress = (event: ProgressEvent) => {
      restartTimeout();
      onUploadProgress?.(event.loaded);
    };
    xhr.onprogress = restartTimeout;
    xhr.onload = () => {
      clearTimeout(timeoutId);
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ text: xhr.responseText, getHeader: (name: string) => xhr.getResponseHeader(name) });
        return;
      }
      reject(new Error(xhr.responseText || xhr.statusText || `Request failed with status ${xhr.status}`));
    };
    xhr.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error('Network error'));
    };
    restartTimeout();
    xhr.send(body ?? null);
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getProcessUrl(config: FileUploadServerConfig): string {
  return `${config.url}${config.processPath ?? ''}`;
}

function getPatchUrl(config: FileUploadServerConfig, transferId: string): string {
  return `${config.url}${config.patchPath ?? '?patch='}${encodeURIComponent(transferId)}`;
}

function getCancelUrl(config: FileUploadServerConfig, transferId: string): string {
  return `${config.url}${config.cancelPath ?? ''}${encodeURIComponent(transferId)}`;
}

function getRevertUrl(config: FileUploadServerConfig): string {
  return `${config.url}${config.revertPath ?? ''}`;
}

/** The configured chunk size, falling back to the default when it is missing or not a positive number. */
function getChunkSize(file: File, config: FileUploadServerConfig): number {
  const chunkSize: number =
    typeof config.chunkSize === 'function' ? config.chunkSize(file) : (config.chunkSize ?? FILE_UPLOAD_DEFAULT_CHUNK_SIZE);
  if (!Number.isFinite(chunkSize) || chunkSize <= 0) {
    return FILE_UPLOAD_DEFAULT_CHUNK_SIZE;
  }
  return Math.max(1, Math.floor(chunkSize));
}

/**
 * `Upload-Name` is always percent-encoded (`encodeURIComponent`), and the server always decodes it
 * (`decodeURIComponent`). FilePond sends the raw name, but a header value can only hold ISO-8859-1,
 * and a rule like "decode when it contains %" cannot tell `100%.txt` from an encoded name.
 */
function getUploadNameHeader(fileName: string): string {
  return encodeURIComponent(fileName);
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

  const response: SendRequestResult = await sendRequest({
    method: 'POST',
    url: getProcessUrl(config),
    body: formData,
    headers: config.headers,
    withCredentials: config.withCredentials,
    timeout: config.timeout,
    onUploadProgress: (loaded: number) => {
      // the body carries a little multipart overhead, so cap below 100 until the server has answered
      onProgress?.(file.size === 0 ? 99 : Math.min(99, (loaded / file.size) * 100));
    },
  });
  onProgress?.(100);
  return response.text;
}

/** Asks the server where to continue, FilePond's resume. Resolves with the next expected offset. */
async function getServerOffset(config: FileUploadServerConfig, transferId: string, fileSize: number): Promise<number> {
  const response: SendRequestResult = await sendRequest({
    method: 'HEAD',
    url: getPatchUrl(config, transferId),
    headers: { ...config.headers, 'Upload-Length': String(fileSize) },
    withCredentials: config.withCredentials,
    timeout: config.timeout,
  });
  // Number(null) and Number('') are 0, which would silently restart the file from the beginning
  const header: string = response.getHeader('Upload-Offset')?.trim() ?? '';
  const offset: number = header === '' ? Number.NaN : Number(header);
  if (!Number.isSafeInteger(offset) || offset < 0) {
    throw new Error('The server answered without a valid Upload-Offset');
  }
  return offset;
}

async function uploadFileInChunks({ file, config, metadata, onProgress }: UploadFileOptions): Promise<string> {
  const fieldName: string = config.fieldName ?? FILE_UPLOAD_DEFAULT_FIELD_NAME;
  const chunkSize: number = getChunkSize(file, config);
  const retryDelays: readonly number[] = config.chunkRetryDelays ?? FILE_UPLOAD_DEFAULT_CHUNK_RETRY_DELAYS;

  const isJsonBody: boolean = config.processBodyFormat === FILE_UPLOAD_PROCESS_BODY_FORMAT.json;
  let startBody: XMLHttpRequestBodyInit;
  if (isJsonBody) {
    startBody = JSON.stringify(metadata ?? {});
  } else {
    const formData = new FormData();
    appendMetadata(formData, fieldName, metadata);
    startBody = formData;
  }
  const transferId: string = (
    await sendRequest({
      method: 'POST',
      url: getProcessUrl(config),
      body: startBody,
      headers: {
        ...config.headers,
        ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
        'Upload-Length': String(file.size),
      },
      withCredentials: config.withCredentials,
      timeout: config.timeout,
    })
  ).text;

  try {
    let offset = 0;
    let retryCount = 0;
    // same slicing as FilePond: an empty file still sends one (empty) chunk
    let isLastChunkSent = false;
    while (!isLastChunkSent) {
      const chunk: Blob = file.slice(offset, offset + chunkSize, 'application/offset+octet-stream');
      try {
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
          timeout: config.timeout,
        });
        offset += chunk.size;
        retryCount = 0;
        isLastChunkSent = offset >= file.size;
      } catch (error: unknown) {
        // like FilePond: wait, ask the server how far it got, and continue from there
        if (retryCount >= retryDelays.length) {
          throw error;
        }
        await sleep(retryDelays[retryCount]);
        retryCount++;
        try {
          offset = Math.min(file.size, await getServerOffset(config, transferId, file.size));
          // an empty file cannot tell from the offset whether its one chunk arrived, so it is sent again
          isLastChunkSent = file.size > 0 && offset >= file.size;
        } catch {
          // the server could not be asked, send the same chunk again on the next round
        }
      }
      // a chunk only counts once the server has confirmed it
      onProgress?.(file.size === 0 ? (isLastChunkSent ? 100 : 0) : (offset / file.size) * 100);
    }
  } catch (error: unknown) {
    // the upload is given up: tell the server so it can drop the half-finished transfer
    if (config.cancelPath !== undefined) {
      cancelTransfer(config, transferId, file.size).catch(() => {
        // best effort, the upload already failed with the original error
      });
    }
    throw error;
  }
  return transferId;
}

/** Uploads one file and resolves with the unique id the server stored it under. */
export function uploadFile(options: UploadFileOptions): Promise<string> {
  const { file, config } = options;
  // a JSON body cannot carry the file, so that format always goes through the chunked flow
  const shouldChunk: boolean =
    config.processBodyFormat === FILE_UPLOAD_PROCESS_BODY_FORMAT.json ||
    (!!config.chunkUploads && (!!config.chunkForce || file.size > getChunkSize(file, config)));
  return shouldChunk ? uploadFileInChunks(options) : uploadFileInOneRequest(options);
}

/** Not part of FilePond: stops a chunked upload on the server, `DELETE <url><cancelPath><id>`. */
export async function cancelTransfer(config: FileUploadServerConfig, transferId: string, fileSize: number): Promise<void> {
  await sendRequest({
    method: 'DELETE',
    url: getCancelUrl(config, transferId),
    headers: { ...config.headers, 'Upload-Length': String(fileSize) },
    withCredentials: config.withCredentials,
    timeout: config.timeout,
  });
}

/** FilePond "revert": asks the server to remove a file it has stored under `serverId`. */
export async function revertUploadedFile(serverId: string, config: FileUploadServerConfig): Promise<string> {
  const response: SendRequestResult = await sendRequest({
    method: 'DELETE',
    url: getRevertUrl(config),
    body: serverId,
    headers: config.headers,
    withCredentials: config.withCredentials,
    timeout: config.timeout,
  });
  return response.text;
}
