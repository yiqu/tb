import { getAiModelUploadChunkSize } from './ai-model-upload.utils';
import { AI_MODEL_UPLOAD_CHUNK_RETRY_DELAYS } from './ai-model-upload.constants';
import { startAiModelUpload, sendAiModelUploadChunk, getAiModelUploadOffset, AiModelUploadRequestError } from './ai-model-upload.api';

/**
 * Uploads one file through the AI model multipart API, the same flow FilePond uses for chunked uploads:
 *
 * 1. `POST` the name, model key and size, get the model artifact id back
 * 2. `PATCH` the file one chunk after the other, each at its `Upload-Offset`
 * 3. a chunk failed: wait, `HEAD` for the offset the server got to, continue from there
 * 4. the retries ran out: the upload fails, but stays on the server so the Retry button can resume it
 *
 * A retry (`resumeArtifactId`) skips step 1: it asks the server for the offset of the failed attempt
 * with `HEAD` and continues from there. Only if the server no longer knows that upload (404 or 410) does
 * it start over with a new `POST`. The last confirmed chunk completes the upload, there is no separate
 * "complete" request.
 */

interface UploadAiModelFileOptions {
  file: File;
  name: string;
  modelKey: string;
  /** The model artifact id of a failed attempt of this file, to resume it instead of starting over. */
  resumeArtifactId?: string | null;
  /** Called once the start request answered, with the model artifact id. */
  onArtifactId?: (artifactId: string) => void;
  /** Called with 0 to 100 every time the server confirmed a chunk, and once when a retry learned where to resume. */
  onProgress?: (progress: number) => void;
}

/** HTTP statuses that mean the server no longer has the upload, so it has to start over. */
const UPLOAD_GONE_STATUSES: readonly number[] = [404, 410];

function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getProgress(offset: number, uploadLength: number, isLastChunkSent: boolean): number {
  if (uploadLength === 0) {
    return isLastChunkSent ? 100 : 0;
  }
  return (offset / uploadLength) * 100;
}

/** Where a failed attempt can continue, or null when the server no longer knows it. Other errors are thrown: the retry fails and can be tried again. */
async function getResumeOffset(artifactId: string, uploadLength: number): Promise<number | null> {
  try {
    return Math.min(uploadLength, await getAiModelUploadOffset({ artifactId, uploadLength }));
  } catch (error: unknown) {
    if (error instanceof AiModelUploadRequestError && UPLOAD_GONE_STATUSES.includes(error.status)) {
      return null;
    }
    throw error;
  }
}

/** Resolves with the model artifact id once the whole file is on the server. */
export async function uploadAiModelFile({ file, name, modelKey, resumeArtifactId, onArtifactId, onProgress }: UploadAiModelFileOptions): Promise<string> {
  const uploadLength: number = file.size;

  let artifactId: string;
  let offset = 0;
  const resumeOffset: number | null = resumeArtifactId ? await getResumeOffset(resumeArtifactId, uploadLength) : null;
  if (resumeArtifactId && resumeOffset !== null) {
    artifactId = resumeArtifactId;
    offset = resumeOffset;
  } else {
    artifactId = await startAiModelUpload({ name, modelKey, uploadLength });
    onArtifactId?.(artifactId);
  }
  // an empty file cannot tell from the offset whether its one chunk arrived, so it is always sent
  let isLastChunkSent: boolean = uploadLength > 0 && offset >= uploadLength;
  onProgress?.(getProgress(offset, uploadLength, isLastChunkSent));

  const chunkSize: number = getAiModelUploadChunkSize(uploadLength);
  let retryCount = 0;
  while (!isLastChunkSent) {
    const chunk: Blob = file.slice(offset, offset + chunkSize);
    try {
      await sendAiModelUploadChunk({ artifactId, uploadLength, chunk, offset });
      offset += chunk.size;
      retryCount = 0;
      isLastChunkSent = offset >= uploadLength;
    } catch (error: unknown) {
      // like FilePond: wait, ask the server how far it got, and continue from there
      if (retryCount >= AI_MODEL_UPLOAD_CHUNK_RETRY_DELAYS.length) {
        throw error;
      }
      await sleep(AI_MODEL_UPLOAD_CHUNK_RETRY_DELAYS[retryCount]);
      retryCount++;
      try {
        offset = Math.min(uploadLength, await getAiModelUploadOffset({ artifactId, uploadLength }));
        isLastChunkSent = uploadLength > 0 && offset >= uploadLength;
      } catch {
        // the server could not be asked, send the same chunk again on the next round
      }
    }
    // a chunk only counts once the server has confirmed it
    onProgress?.(getProgress(offset, uploadLength, isLastChunkSent));
  }
  return artifactId;
}
