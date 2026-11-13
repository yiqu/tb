import type { FileUploadServerConfig } from '@/components/file-upload/file-upload.models';

/** The only extensions the example accepts. An empty array allows every file type. */
export const FILE_UPLOAD_DEMO_ALLOWED_EXTENSIONS: string[] = ['.txt'];

/** How many chunks every file of the example is cut into, so even a tiny text file reports progress step by step. */
const FILE_UPLOAD_DEMO_CHUNK_COUNT = 25;

/**
 * Points the example at the mock FilePond server in `app/api/filepond-mock/route.ts`, which is slowed
 * down on purpose. For the real backend: change `url`, and drop `chunkSize` (FilePond's default is
 * 5MB) or turn the chunk options off if the backend does not support chunked uploads.
 */
export const FILE_UPLOAD_DEMO_SERVER: FileUploadServerConfig = {
  url: '/api/filepond-mock',
  chunkUploads: true,
  chunkForce: true,
  chunkSize: (file: File) => Math.ceil(file.size / FILE_UPLOAD_DEMO_CHUNK_COUNT),
  maxParallelUploads: 3,
};
