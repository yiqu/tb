/** Lifecycle of one upload once the user has pressed Upload. */
export const AI_MODEL_UPLOAD_STATUS = {
  queued: 'queued',
  uploading: 'uploading',
  completed: 'completed',
  failed: 'failed',
} as const;

/**
 * Phases of one upload session (what the dialog is currently showing).
 *
 * - `empty`     — drop zone with nothing in it
 * - `staging`   — a file is selected (FilePond calls these "idle" items) but nothing was sent yet
 * - `uploading` — Upload was pressed and the session's upload is still running
 * - `completed` — every file of the session reached the server
 * - `failed`    — the session is finished and at least one file failed
 */
export const AI_MODEL_UPLOAD_PHASE = {
  empty: 'empty',
  staging: 'staging',
  uploading: 'uploading',
  completed: 'completed',
  failed: 'failed',
} as const;

/** File types the drop zone accepts unless `allowedExtensions` is passed, e.g. `['.onnx', '.pt']`. Empty allows every type. */
export const AI_MODEL_UPLOAD_DEFAULT_ALLOWED_EXTENSIONS: readonly string[] = [];

/** TanStack Query mutation key of one file upload, e.g. for `useMutationState` or `useIsMutating`. */
export const AI_MODEL_UPLOAD_MUTATION_KEY = ['ai-model-upload'] as const;

/** TanStack Query mutation key of the request that stops an upload on the server. */
export const AI_MODEL_UPLOAD_CANCEL_MUTATION_KEY = ['ai-model-upload', 'cancel'] as const;

/**
 * Largest chunk sent in one PATCH, in bytes. 5MB is FilePond's default chunk size; the backend's own
 * limit is not confirmed yet.
 */
export const AI_MODEL_UPLOAD_MAX_CHUNK_BYTES = 5_000_000;

/** A small file is still cut into about this many chunks, so its progress moves in steps instead of jumping to 100%. */
export const AI_MODEL_UPLOAD_MIN_CHUNK_COUNT = 25;

/**
 * `Content-Type` of a chunk. `application/offset+octet-stream` is what FilePond and the tus resumable
 * upload protocol send for raw bytes at an offset. Not confirmed for the AI model API yet.
 */
export const AI_MODEL_UPLOAD_CHUNK_CONTENT_TYPE = 'application/offset+octet-stream';

/** FilePond's default `chunkRetryDelays`: wait this long (ms) before each retry of a failed chunk. */
export const AI_MODEL_UPLOAD_CHUNK_RETRY_DELAYS: readonly number[] = [500, 1000, 3000];

/** A request that has not answered after this long (ms) fails. It must be longer than sending one chunk takes. `0` waits forever. */
export const AI_MODEL_UPLOAD_REQUEST_TIMEOUT_MS = 60_000;

/**
 * How much the newest speed sample counts in the smoothed upload speed (0 to 1). Lower is steadier,
 * higher follows a changing connection faster.
 */
export const AI_MODEL_UPLOAD_SPEED_SMOOTHING = 0.3;

/** Below this many seconds the time left reads "A few seconds left" instead of a number. */
export const AI_MODEL_UPLOAD_TIME_REMAINING_FEW_SECONDS = 5;

/** Progress (in percent) at which a progress bar switches from the "in progress" to the "almost done" color. */
export const AI_MODEL_UPLOAD_PROGRESS_COLOR_THRESHOLD = 70;

/** Lucide "trash-2" as an SVG string, sized for FilePond's 26x26 icon box (FilePond icons are raw SVG strings). */
export const AI_MODEL_UPLOAD_REMOVE_ICON_SVG =
  '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><g transform="translate(5 5) scale(0.6667)" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></g></svg>';

/** Wording. Edit it here. */
export const AI_MODEL_UPLOAD_BUTTON_LABEL = 'Upload Model';
export const AI_MODEL_UPLOAD_DIALOG_TITLE = 'Upload Model';
export const AI_MODEL_UPLOAD_NAME_LABEL = 'Name';
export const AI_MODEL_UPLOAD_NAME_PLACEHOLDER = 'The name the model file is saved as';
export const AI_MODEL_UPLOAD_MODEL_KEY_LABEL = 'Model Key';
export const AI_MODEL_UPLOAD_MODEL_KEY_PLACEHOLDER = 'Enter a model key';
export const AI_MODEL_UPLOAD_SUBMIT_LABEL = 'Upload';
export const AI_MODEL_UPLOAD_SUBMITTING_LABEL = 'Uploading';
export const AI_MODEL_UPLOAD_NEW_UPLOAD_LABEL = 'New upload';
export const AI_MODEL_UPLOAD_COMPLETED_MESSAGE = 'Upload completed';
export const AI_MODEL_UPLOAD_FAILED_MESSAGE = 'The upload failed';
export const AI_MODEL_UPLOAD_EMPTY_STATUS_MESSAGE = 'No uploads yet.';
export const AI_MODEL_UPLOAD_CLEAR_FINISHED_LABEL = 'Clear finished';
export const AI_MODEL_UPLOAD_ACTIVE_INDICATOR_LABEL = 'Uploads in progress';
/** Time-left line under a running upload's progress bar. */
export const AI_MODEL_UPLOAD_TIME_REMAINING_CALCULATING = 'Calculating time left…';
export const AI_MODEL_UPLOAD_TIME_REMAINING_FEW_SECONDS_LABEL = 'A few seconds left';
export const getAiModelUploadTimeRemainingLabel = (duration: string): string => `About ${duration} left`;
/** Label of the section that lists the uploads still running when the dialog is opened again. */
export const AI_MODEL_UPLOAD_IN_PROGRESS_SECTION_TITLE = 'Currently uploading';
/** Info alert shown in the dialog while its upload is running. */
export const AI_MODEL_UPLOAD_IN_PROGRESS_ALERT_TITLE = 'Your model is uploading';
export const AI_MODEL_UPLOAD_IN_PROGRESS_ALERT_MESSAGE =
  'No need to wait here. You can close this dialog and keep working, or start another upload. The upload continues in the background, check its progress anytime under the bell in the top bar.';
