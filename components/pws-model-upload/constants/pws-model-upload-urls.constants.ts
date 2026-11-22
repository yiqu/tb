/**
 * The backend this feature talks to. When the feature is copied into another project, this is the
 * file to change: point the URLs at that project's PWS model API. Nothing else needs to know them.
 *
 * The API (from its Swagger):
 *
 * | step   | request                                                     | details                                                                         |
 * | ------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
 * | start  | `POST   PWS_MODEL_UPLOAD_START_URL`                          | JSON `{ "name", "modelKey" }`, header `Upload-Length`. -> the model artifact id `AMAR-<uuid>` as plain text |
 * | chunk  | `PATCH  PWS_MODEL_UPLOAD_ARTIFACT_URL` (`{artifactId}` set)  | the chunk's raw bytes, headers `Upload-Offset`, `Upload-Length`                  |
 * | resume | `HEAD   PWS_MODEL_UPLOAD_ARTIFACT_URL`                       | header `Upload-Length`. -> header `Upload-Offset`, where the upload continues    |
 * | cancel | `DELETE PWS_MODEL_UPLOAD_ARTIFACT_URL`                       | header `Upload-Length`. Stops the upload                                         |
 *
 * In this project both point at the mock in `app/api/pws-models/multipart-upload/`, which sits at the
 * same paths as the real API.
 */

/**
 * `POST`: starts a multipart model upload (Swagger: "multipart model upload start").
 * The Swagger path ends with a slash (`/api/pws-models/multipart-upload/`). Next.js redirects such a path
 * to the one without the slash, so the mock is called without it; keep the slash for a backend that needs it.
 */
export const PWS_MODEL_UPLOAD_START_URL = '/api/pws-models/multipart-upload';

/**
 * `PATCH` (send a chunk), `HEAD` (get the offset of an upload in progress) and `DELETE` (stop an upload).
 * `{artifactId}` is replaced with the id the start request answered with.
 */
export const PWS_MODEL_UPLOAD_ARTIFACT_URL = '/api/pws-models/multipart-upload/{artifactId}';

/** Placeholder in `PWS_MODEL_UPLOAD_ARTIFACT_URL` that is replaced with the model artifact id. */
export const PWS_MODEL_UPLOAD_ARTIFACT_ID_PLACEHOLDER = '{artifactId}';

/**
 * Optional. Sent with every request, e.g. `{ Authorization: 'Bearer …' }`. Leave empty when the backend
 * authenticates with cookies.
 */
export const PWS_MODEL_UPLOAD_REQUEST_HEADERS: Record<string, string> = {};

/** Optional. `include` sends cookies to a backend on another origin, `same-origin` (default) only to this one. */
export const PWS_MODEL_UPLOAD_REQUEST_CREDENTIALS: RequestCredentials = 'same-origin';
