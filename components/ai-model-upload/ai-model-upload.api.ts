import { AI_MODEL_UPLOAD_REQUEST_TIMEOUT_MS, AI_MODEL_UPLOAD_CHUNK_CONTENT_TYPE } from './ai-model-upload.constants';
import {
  AI_MODEL_UPLOAD_START_URL,
  AI_MODEL_UPLOAD_ARTIFACT_URL,
  AI_MODEL_UPLOAD_REQUEST_HEADERS,
  AI_MODEL_UPLOAD_REQUEST_CREDENTIALS,
  AI_MODEL_UPLOAD_ARTIFACT_ID_PLACEHOLDER,
} from './ai-model-upload-urls.constants';

/**
 * One function per endpoint of the AI model multipart upload API, see `ai-model-upload-urls.constants.ts`.
 * Plain `fetch`: they are called from the upload mutation (`useAiModelUploadMutation`), which TanStack
 * Query runs. Every chunk is confirmed by the server before progress moves, so the upload progress
 * events that only `XMLHttpRequest` has are not needed.
 */

interface StartAiModelUploadRequest {
  name: string;
  modelKey: string;
  /** Size of the whole file in bytes, the `Upload-Length` header. */
  uploadLength: number;
}

interface AiModelUploadArtifactRequest {
  /** The model artifact id the start request answered with. */
  artifactId: string;
  /** Size of the whole file in bytes, the `Upload-Length` header. */
  uploadLength: number;
}

interface SendAiModelUploadChunkRequest extends AiModelUploadArtifactRequest {
  chunk: Blob;
  /** Byte offset of this chunk in the file, the `Upload-Offset` header. */
  offset: number;
}

/** A request that got an answer, but not a 2xx one. `status` tells e.g. a 404 (the server no longer knows the upload) apart. */
export class AiModelUploadRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AiModelUploadRequestError';
    this.status = status;
  }
}

function getArtifactUrl(artifactId: string): string {
  return AI_MODEL_UPLOAD_ARTIFACT_URL.replace(AI_MODEL_UPLOAD_ARTIFACT_ID_PLACEHOLDER, encodeURIComponent(artifactId));
}

/** `fetch` with the configured headers, credentials and timeout. Rejects with a readable message unless the answer is 2xx (`AiModelUploadRequestError` when there was an answer). */
async function request(url: string, init: RequestInit): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: { ...AI_MODEL_UPLOAD_REQUEST_HEADERS, ...init.headers },
      credentials: AI_MODEL_UPLOAD_REQUEST_CREDENTIALS,
      signal: AI_MODEL_UPLOAD_REQUEST_TIMEOUT_MS > 0 ? AbortSignal.timeout(AI_MODEL_UPLOAD_REQUEST_TIMEOUT_MS) : undefined,
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
    throw new AiModelUploadRequestError(text.trim() || response.statusText || `Request failed with status ${response.status}`, response.status);
  }
  return response;
}

/** Step 1, `POST`: starts the upload. Resolves with the model artifact id (`AMAR-<uuid>`). */
export async function startAiModelUpload({ name, modelKey, uploadLength }: StartAiModelUploadRequest): Promise<string> {
  const response: Response = await request(AI_MODEL_UPLOAD_START_URL, {
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
export async function sendAiModelUploadChunk({ artifactId, uploadLength, chunk, offset }: SendAiModelUploadChunkRequest): Promise<void> {
  await request(getArtifactUrl(artifactId), {
    method: 'PATCH',
    headers: {
      'Content-Type': AI_MODEL_UPLOAD_CHUNK_CONTENT_TYPE,
      'Upload-Offset': String(offset),
      'Upload-Length': String(uploadLength),
    },
    body: chunk,
  });
}

/** Step 3, `HEAD`: asks where an upload in progress continues. Resolves with the next expected offset. */
export async function getAiModelUploadOffset({ artifactId, uploadLength }: AiModelUploadArtifactRequest): Promise<number> {
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
export async function cancelAiModelUpload({ artifactId, uploadLength }: AiModelUploadArtifactRequest): Promise<void> {
  await request(getArtifactUrl(artifactId), {
    method: 'DELETE',
    headers: { 'Upload-Length': String(uploadLength) },
  });
}
