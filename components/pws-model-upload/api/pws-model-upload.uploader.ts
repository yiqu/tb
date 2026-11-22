import { getAiModelUploadChunkSize } from '../utils/ai-model-upload.utils';
import { AI_MODEL_UPLOAD_CHUNK_RETRY_DELAYS } from '../constants/ai-model-upload.constants';
import { startAiModelUpload, sendAiModelUploadChunk, getAiModelUploadOffset } from './ai-model-upload.api';

/**
 * Uploads one file through the AI model multipart API, the same flow FilePond uses for chunked uploads:
 *
 * 1. `POST` the name, model key and size, get the model artifact id back
 * 2. `PATCH` the file one chunk after the other, each at its `Upload-Offset`
 * 3. a chunk failed: wait, `HEAD` for the offset the server got to, continue from there
 * 4. the retries ran out: the upload fails
 *
 * The Retry button runs this whole flow again from step 1 with a new `POST`, after a `DELETE` of the
 * failed attempt. The last confirmed chunk completes the upload, there is no separate "complete" request.
 */

interface UploadAiModelFileOptions {
  file: File;
  name: string;
  modelKey: string;
  /** Called once the start request answered, with the model artifact id. */
  onArtifactId?: (artifactId: string) => void;
  /**
   * Called once the upload started (at 0) and every time the server confirmed a chunk: the bytes on
   * the server, and the same as 0 to 100.
   */
  onProgress?: (progress: number, uploadedBytes: number) => void;
}

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

/** Resolves with the model artifact id once the whole file is on the server. */
export async function uploadAiModelFile({ file, name, modelKey, onArtifactId, onProgress }: UploadAiModelFileOptions): Promise<string> {
  const uploadLength: number = file.size;

  const artifactId: string = await startAiModelUpload({ name, modelKey, uploadLength });
  onArtifactId?.(artifactId);
  let offset = 0;
  // an empty file cannot tell from the offset whether its one chunk arrived, so it is always sent
  let isLastChunkSent = false;
  onProgress?.(0, offset);

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
    onProgress?.(getProgress(offset, uploadLength, isLastChunkSent), offset);
  }
  return artifactId;
}
