import { FILE_UPLOAD_PROCESS_BODY_FORMAT } from '@/components/file-upload/file-upload.constants';

import type { FileUploadServerConfig } from '@/components/file-upload/file-upload.models';

/** Extensions the form accepts. Empty allows every file type. */
export const AI_MODEL_UPLOAD_ALLOWED_EXTENSIONS: string[] = [];

/** One model per upload: the typed name becomes the stored file's name, so it can only belong to one file. */
export const AI_MODEL_UPLOAD_ALLOW_MULTIPLE = false;

/**
 * Largest chunk sent in one PATCH. The backend's real limit is not confirmed yet; 5MB is FilePond's
 * default chunk size.
 */
const AI_MODEL_UPLOAD_MAX_CHUNK_BYTES = 5_000_000;

/** Small files are still cut into about this many chunks, so their progress moves in steps instead of jumping to 100%. */
const AI_MODEL_UPLOAD_MIN_CHUNK_COUNT = 25;

/**
 * The AI model multipart upload API:
 *
 * | step   | request                                              | details                                                         |
 * | ------ | ---------------------------------------------------- | --------------------------------------------------------------- |
 * | start  | `POST   /api/ai-models/multipart-upload/`            | JSON `{ name, modelKey }`, header `Upload-Length`. -> `AMAR-<uuid>` as text |
 * | chunk  | `PATCH  /api/ai-models/multipart-upload/<id>`        | raw chunk, headers `Upload-Offset`, `Upload-Length`              |
 * | resume | `HEAD   /api/ai-models/multipart-upload/<id>`        | header `Upload-Length`. -> header `Upload-Offset`                |
 * | cancel | `DELETE /api/ai-models/multipart-upload/<id>`        | header `Upload-Length`                                           |
 *
 * It points at the slow mock in `app/api/ai-models-mock/multipart-upload/`. For the real backend change
 * `url` to `/api/ai-models/multipart-upload` and `processPath` to `'/'` (the start endpoint ends with a slash).
 */
export const AI_MODEL_UPLOAD_SERVER: FileUploadServerConfig = {
  url: '/api/ai-models-mock/multipart-upload',
  processPath: '',
  patchPath: '/',
  cancelPath: '/',
  processBodyFormat: FILE_UPLOAD_PROCESS_BODY_FORMAT.json,
  chunkUploads: true,
  chunkForce: true,
  chunkSize: (file: File) => Math.min(AI_MODEL_UPLOAD_MAX_CHUNK_BYTES, Math.ceil(file.size / AI_MODEL_UPLOAD_MIN_CHUNK_COUNT)),
  maxParallelUploads: 3,
};

export const AI_MODEL_UPLOAD_SECTION_TITLE = 'AI model upload';
export const AI_MODEL_UPLOAD_SECTION_DESCRIPTION =
  'Enter a name and a model key, select the model file, then upload it. The mock server is slow on purpose. Closing the dialog does not cancel anything, the progress stays visible under the bell in the top navigation.';
export const AI_MODEL_UPLOAD_DIALOG_TRIGGER_LABEL = 'Upload AI Model';
export const AI_MODEL_UPLOAD_DIALOG_TITLE = 'Upload AI Model';
export const AI_MODEL_UPLOAD_NAME_LABEL = 'Name';
export const AI_MODEL_UPLOAD_NAME_PLACEHOLDER = 'The name the model file is saved as';
export const AI_MODEL_UPLOAD_MODEL_KEY_LABEL = 'Model Key';
export const AI_MODEL_UPLOAD_MODEL_KEY_PLACEHOLDER = 'Enter a model key';
export const AI_MODEL_UPLOAD_NEW_UPLOAD_LABEL = 'New upload';
