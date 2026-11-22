import { PWS_MODEL_UPLOAD_REQUEST_TIMEOUT_MS, PWS_MODEL_UPLOAD_CHUNK_CONTENT_TYPE } from '../constants/pws-model-upload.constants';
import {
  PWS_MODEL_UPLOAD_START_URL,
  PWS_MODEL_UPLOAD_ARTIFACT_URL,
  PWS_MODEL_UPLOAD_REQUEST_HEADERS,
  PWS_MODEL_UPLOAD_REQUEST_CREDENTIALS,
  PWS_MODEL_UPLOAD_ARTIFACT_ID_PLACEHOLDER,
} from '../constants/pws-model-upload-urls.constants';

/**
 * One function per endpoint of the PWS model multipart upload API, see `pws-model-upload-urls.constants.ts`.
 * Plain `fetch`: they are called from the upload mutation (`usePwsModelUploadMutation`), which TanStack
 * Query runs. Every chunk is confirmed by the server before progress moves, so the upload progress
 * events that only `XMLHttpRequest` has are not needed.
 */

interface StartPwsModelUploadRequest {
  name: string;
  modelKey: string;
  /** Size of the whole file in bytes, the `Upload-Length` header. */
  uploadLength: number;
}

interface PwsModelUploadArtifactRequest {
  /** The model artifact id the start request answered with. */
  artifactId: string;
  /** Size of the whole file in bytes, the `Upload-Length` header. */
  uploadLength: number;
}

interface SendPwsModelUploadChunkRequest extends PwsModelUploadArtifactRequest {
  chunk: Blob;
  /** Byte offset of this chunk in the file, the `Upload-Offset` header. */
  offset: number;
}

/** A request that got an answer, but not a 2xx one. `status` tells e.g. a 404 (the server no longer knows the upload) apart. */
export class PwsModelUploadRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'PwsModelUploadRequestError';
    this.status = status;
  }
}

function getArtifactUrl(artifactId: string): string {
  return PWS_MODEL_UPLOAD_ARTIFACT_URL.replace(PWS_MODEL_UPLOAD_ARTIFACT_ID_PLACEHOLDER, encodeURIComponent(artifactId));
}

/** `fetch` with the configured headers, credentials and timeout. Rejects with a readable message unless the answer is 2xx (`PwsModelUploadRequestError` when there was an answer). */
async function request(url: string, init: RequestInit): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: { ...PWS_MODEL_UPLOAD_REQUEST_HEADERS, ...init.headers },
      credentials: PWS_MODEL_UPLOAD_REQUEST_CREDENTIALS,
      signal: PWS_MODEL_UPLOAD_REQUEST_TIMEOUT_MS > 0 ? AbortSignal.timeout(PWS_MODEL_UPLOAD_REQUEST_TIMEOUT_MS) : undefined,
    });
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new Error('Request timed out');
    }
    throw new Error('Network error');
  }
  if (!response.ok) {
    const text: string = await response.text().catch(() => {
      return '';
    });
    throw new PwsModelUploadRequestError(text.trim() || response.statusText || `Request failed with status ${response.status}`, response.status);
  }
  return response;
}

/** Step 1, `POST`: starts the upload. Resolves with the model artifact id (`AMAR-<uuid>`). */
export async function startPwsModelUpload({ name, modelKey, uploadLength }: StartPwsModelUploadRequest): Promise<string> {
  const response: Response = await request(PWS_MODEL_UPLOAD_START_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Upload-Length': String(uploadLength) },
    body: JSON.stringify({ name, modelKey }),
  });
  const artifactId: string = (await response.text()).trim();
  if (artifactId === '') {
    throw new Error('The server did not answer with a model artifact id');
  }
  return artifactId;
}

/** Step 2, `PATCH`: sends one chunk. Called once per chunk until the whole file is sent. */
export async function sendPwsModelUploadChunk({ artifactId, uploadLength, chunk, offset }: SendPwsModelUploadChunkRequest): Promise<void> {
  await request(getArtifactUrl(artifactId), {
    method: 'PATCH',
    headers: {
      'Content-Type': PWS_MODEL_UPLOAD_CHUNK_CONTENT_TYPE,
      'Upload-Offset': String(offset),
      'Upload-Length': String(uploadLength),
    },
    body: chunk,
  });
}

/** Step 3, `HEAD`: asks where an upload in progress continues. Resolves with the next expected offset. */
export async function getPwsModelUploadOffset({ artifactId, uploadLength }: PwsModelUploadArtifactRequest): Promise<number> {
  const response: Response = await request(getArtifactUrl(artifactId), {
    method: 'HEAD',
    headers: { 'Upload-Length': String(uploadLength) },
  });
  // Number(null) and Number('') are 0, which would silently restart the file from the beginning
  const header: string = response.headers.get('Upload-Offset')?.trim() ?? '';
  const offset: number = header === '' ? Number.NaN : Number(header);
  if (!Number.isSafeInteger(offset) || offset < 0) {
    throw new Error('The server answered without a valid Upload-Offset');
  }
  return offset;
}

/** Step 4, `DELETE`: stops an upload on the server. */
export async function cancelPwsModelUpload({ artifactId, uploadLength }: PwsModelUploadArtifactRequest): Promise<void> {
  await request(getArtifactUrl(artifactId), {
    method: 'DELETE',
    headers: { 'Upload-Length': String(uploadLength) },
  });
}
