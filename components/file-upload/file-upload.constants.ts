/** Lifecycle of one file once the user has pressed Upload. */
export const FILE_UPLOAD_STATUS = {
  queued: 'queued',
  uploading: 'uploading',
  completed: 'completed',
  failed: 'failed',
} as const;

/**
 * Phases of one upload session (what the upload surface, e.g. a dialog, is currently showing).
 *
 * - `empty`     — drop zone with nothing in it
 * - `staging`   — files are selected (FilePond calls these "idle" items) but nothing was sent yet
 * - `uploading` — Upload was pressed, at least one file of the session is still queued or in flight
 * - `completed` — every file of the session reached the server
 * - `failed`    — the session is finished and at least one file failed
 */
export const FILE_UPLOAD_PHASE = {
  empty: 'empty',
  staging: 'staging',
  uploading: 'uploading',
  completed: 'completed',
  failed: 'failed',
} as const;

/** Progress (in percent) at which a progress bar switches from the "in progress" to the "almost done" color. */
export const FILE_UPLOAD_PROGRESS_COLOR_THRESHOLD = 70;

/** FilePond's default form field name. The metadata and the file are both posted under this name. */
export const FILE_UPLOAD_DEFAULT_FIELD_NAME = 'filepond';

/** FilePond's default chunk size (5MB). */
export const FILE_UPLOAD_DEFAULT_CHUNK_SIZE = 5_000_000;

/** FilePond's default for `maxParallelUploads`. */
export const FILE_UPLOAD_DEFAULT_MAX_PARALLEL_UPLOADS = 2;

/** Lucide "trash-2" as an SVG string, sized for FilePond's 26x26 icon box (FilePond icons are raw SVG strings). */
export const FILE_UPLOAD_REMOVE_ICON_SVG =
  '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><g transform="translate(5 5) scale(0.6667)" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></g></svg>';

/** Info alert shown on an upload surface while files are uploading. Edit the wording here. */
export const FILE_UPLOAD_IN_PROGRESS_ALERT_TITLE = 'Your files are uploading';
export const FILE_UPLOAD_IN_PROGRESS_ALERT_MESSAGE =
  'No need to wait here. You can close this dialog and keep working, the upload will continue in the background. Check its progress anytime under the bell in the top bar.';
