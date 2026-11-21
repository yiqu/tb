import { getAiModelUploadChunkSize } from './ai-model-upload.utils';
import { AI_MODEL_UPLOAD_CHUNK_RETRY_DELAYS } from './ai-model-upload.constants';
import { startAiModelUpload, cancelAiModelUpload, sendAiModelUploadChunk, getAiModelUploadOffset } from './ai-model-upload.api';

/**
 * Uploads one file through the AI model multipart API, the same flow FilePond uses for chunked uploads:
 *
 * 1. `POST` the name, model key and size, get the model artifact id back
 * 2. `PATCH` the file one chunk after the other, each at its `Upload-Offset`
 * 3. a chunk failed: wait, `HEAD` for the offset the server got to, continue from there
 * 4. the retries ran out: `DELETE` the half finished upload and fail
 *
 * The last confirmed chunk completes the upload, there is no separate "complete" request.
 */

interface UploadAiModelFileOptions {
  file: File;
  name: string;
  modelKey: string;
  /** Called once the start request answered, with the model artifact id. */
  onArtifactId?: (artifactId: string) => void;
  /** Called with 0 to 100 every time the server confirmed a chunk. */
  onProgress?: (progress: number) => void;
}

function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Resolves with the model artifact id once the whole file is on the server. */
export async function uploadAiModelFile({ file, name, modelKey, onArtifactId, onProgress }: UploadAiModelFileOptions): Promise<string> {
  const uploadLength: number = file.size;
  const artifactId: string = await startAiModelUpload({ name, modelKey, uploadLength });
  onArtifactId?.(artifactId);

  const chunkSize: number = getAiModelUploadChunkSize(uploadLength);
  try {
    let offset = 0;
    let retryCount = 0;
    // same slicing as FilePond: an empty file still sends one (empty) chunk
    let isLastChunkSent = false;
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
          // an empty file cannot tell from the offset whether its one chunk arrived, so it is sent again
          isLastChunkSent = uploadLength > 0 && offset >= uploadLength;
        } catch {
          // the server could not be asked, send the same chunk again on the next round
        }
      }
      // a chunk only counts once the server has confirmed it
      onProgress?.(uploadLength === 0 ? (isLastChunkSent ? 100 : 0) : (offset / uploadLength) * 100);
    }
  } catch (error: unknown) {
    // the upload is given up: stop it on the server so it does not linger half done
    cancelAiModelUpload({ artifactId, uploadLength }).catch(() => {
      // best effort, the upload already failed with the original error
    });
    throw error;
  }
  return artifactId;
}
