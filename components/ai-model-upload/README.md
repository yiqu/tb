# AI model upload

A drop-in "Upload Model" feature. Put `<UploadModelButton />` anywhere: it opens a dialog with a
**Name** and a **Model Key** field and a [FilePond](https://pqina.nl/filepond/docs/) drop zone, and
uploads the model file in chunks to the AI model multipart API. Uploads keep running after the dialog
closes, the dialog can be opened again to start another upload while earlier ones are still going,
and every upload is listed with its progress and an estimate of the time left in the notifications
popover (and its progress in the browser tab title).

In this project the demo is on the `/test` page, against a slow mock of the API at
`app/api/ai-models/multipart-upload/`.

## Using it in another project

1. Copy this folder.
2. Point the URLs in **`constants/ai-model-upload-urls.constants.ts`** at that project's API. That is the only
   file that knows the backend (optional request headers and credentials are there too).
3. Drop in the pieces:

```tsx
import UploadModelButton from '@/components/ai-model-upload/components/UploadModelButton';
import AiModelUploadDocumentTitle from '@/components/ai-model-upload/components/AiModelUploadDocumentTitle';
import AiModelUploadStatusOverview from '@/components/ai-model-upload/components/AiModelUploadStatusOverview';
import AiModelUploadActiveIndicator from '@/components/ai-model-upload/components/AiModelUploadActiveIndicator';
import AiModelUploadClearFinishedButton from '@/components/ai-model-upload/components/AiModelUploadClearFinishedButton';

// anywhere: the button and its dialog
<UploadModelButton />
<UploadModelButton allowMultiple allowedExtensions={ ['.onnx', '.pt'] } />

// optional, once in a layout that stays mounted: progress in the browser tab title
<AiModelUploadDocumentTitle />

// optional, in a notifications popover or any panel: every upload with its progress
<AiModelUploadActiveIndicator />       {/* pulsing dot while something uploads */}
<AiModelUploadClearFinishedButton />
<AiModelUploadStatusOverview />
```

What the folder needs from the project: a TanStack Query `QueryClientProvider` above the button,
`zustand`, `react-hook-form`, `@hookform/resolvers`, `zod`, `filepond`, `react-filepond`,
`lucide-react`, the shadcn `button`, `dialog`, `field`, `input`, `separator`, `skeleton`, `progress`,
`alert` and `spinner` components with `cn` from `@/lib/utils`, and this project's `Typography`,
`RowStack` and `ColumnStack`. It uses `next/dynamic` to load FilePond only when the dialog opens.

`UploadModelButton` props:

| Prop | Default | What it does |
| --- | --- | --- |
| `allowMultiple` | `false` | Let the drop zone take more than one file. Every file then becomes its own upload with the same name and model key. |
| `allowedExtensions` | `[]` (every type) | File types the drop zone accepts, e.g. `['.onnx']`. |
| any `Button` prop except `onClick`, `type` and `asChild` | `size="sm"` | Passed to the trigger button. `children` replaces the "Upload Model" label. The button opens the dialog itself, so it takes no `onClick`. |

## The API

From the backend's Swagger. The URLs are `AI_MODEL_UPLOAD_START_URL` and
`AI_MODEL_UPLOAD_ARTIFACT_URL` (with `{artifactId}` replaced) in `constants/ai-model-upload-urls.constants.ts`.

| Step | Request | Details | Response |
| --- | --- | --- | --- |
| 1. Start | `POST /api/ai-models/multipart-upload/` | `application/json` body `{ "name": "...", "modelKey": "..." }`. Header `Upload-Length: <file size>` (required, max 5497558138880). | `200`, plain text: the model artifact id, `AMAR-<uuid>`. |
| 2. Chunk | `PATCH /api/ai-models/multipart-upload/{artifactId}` | The chunk's raw bytes. Headers `Upload-Offset: <byte offset of the chunk>`, `Upload-Length: <file size>`. | 2xx |
| 3. Resume | `HEAD /api/ai-models/multipart-upload/{artifactId}` | Header `Upload-Length`. | Header `Upload-Offset: <next expected offset>`. |
| 4. Cancel | `DELETE /api/ai-models/multipart-upload/{artifactId}` | Header `Upload-Length`. Sent for a failed upload when Retry starts it over or it is cleared away. | 2xx |

Step 1 runs once, step 2 once per chunk until the whole file is sent; the last chunk completes the
upload, there is no "complete" request. Step 3 runs after a chunk failed, to continue from where the
server got to. Step 4 runs for a failed upload when Retry starts it over or it is cleared away. An upload
that is abandoned another way (the tab is closed) stays unfinished on the server, which should expire it.
`useAiModelUploadCancelMutation` sends step 4. This is FilePond's own chunked protocol, with the metadata sent as JSON and the
id in the path instead of `?patch=<id>`.

Still to confirm with the backend team, both are constants in `constants/ai-model-upload.constants.ts`:

- **Chunk size.** `AI_MODEL_UPLOAD_MAX_CHUNK_BYTES` is 5MB, FilePond's default. Small files are cut
  into about 25 chunks (`AI_MODEL_UPLOAD_MIN_CHUNK_COUNT`) so their progress moves in steps.
- **Chunk `Content-Type`.** `AI_MODEL_UPLOAD_CHUNK_CONTENT_TYPE` is `application/offset+octet-stream`,
  what FilePond and the tus resumable upload protocol send.

A backend on another origin must answer the CORS preflight:

- `Access-Control-Allow-Origin` on the preflight and on every actual response: the app's origin, or
  `*` when no credentials are sent.
- `Access-Control-Allow-Methods`: `POST, PATCH, HEAD, DELETE`.
- `Access-Control-Allow-Headers`: `Content-Type` (the start and chunk requests send `application/json`
  and `application/offset+octet-stream`, which are not CORS-safelisted), `Upload-Length`,
  `Upload-Offset`, and any header added in `AI_MODEL_UPLOAD_REQUEST_HEADERS` (e.g. `Authorization`).
- `Access-Control-Expose-Headers: Upload-Offset`, or the browser hides it from `HEAD`.
- With `AI_MODEL_UPLOAD_REQUEST_CREDENTIALS = 'include'` (cookies on another origin):
  `Access-Control-Allow-Credentials: true`, and `Access-Control-Allow-Origin` must be the exact origin, not `*`.

## How it is built

| Piece | Job |
| --- | --- |
| **FilePond** (`AiModelUploadDropzone`) | Only picks files: drag and drop, Browse, the staged file with its remove button. It never sends anything. |
| **React Hook Form + Zod** (`schemas/ai-model-upload.schema.ts`) | Name and model key are required; the Upload button stays disabled until both pass. |
| **TanStack Query** (`hooks/useAiModelUploadMutation.ts`) | One mutation per file. It runs the upload and owns its lifecycle (pending, success, error); uploads show up in the React Query devtools under `['ai-model-upload']`. |
| **`fetch`** (`api/ai-model-upload.api.ts`) | One function per endpoint, called from inside the mutation. |
| **Zustand** (`store/ai-model-upload.store.ts`) | What the UI shows: the staged file, the typed name and model key, and every upload with its status and progress. |

Why FilePond does not upload by itself: it cancels every running upload when its component
unmounts, and the dialog unmounts when it closes. So the sending is done by TanStack Query mutations,
which keep running after the dialog is gone. Their callbacks are set on `useMutation` (not on
`mutate`), because TanStack Query only drops `mutate`'s callbacks when the component unmounts.

Why `fetch` and not `XMLHttpRequest`: progress counts chunks the server has confirmed, so the
browser's upload progress events (which `fetch` does not have) are not needed.

How the drop zone is wired: FilePond's `instantUpload`, `allowProcess` and `allowRevert` are off and it
gets no `server` option. It owns its list while mounted and reports every change (`onaddfile`,
`onremovefile`) to the store. When the dialog opens again, `oninit` gives it back the staged file with
`addFiles`. The browse input's `accept` attribute is set by hand because FilePond has no option for it.

## An upload, step by step

**In the dialog**

1. **The Upload Model button opens the dialog.** If the last upload from it has finished (or there
   was none), the form starts empty. A failed upload stays, so its Retry button is still there. Any
   uploads still running are listed at the top under "Currently uploading".
2. **The user types a name and a model key and picks the file.** FilePond calls `beforeAddFile`,
   which refuses a type outside `allowedExtensions`. The file goes into the store as staged.
3. **Upload is pressed** (enabled once both fields pass the Zod schema). `startSession` turns each
   staged file into an upload item (`queued`, 0%) with that name and model key, clears the form for
   next time, and makes the dialog show its progress. `mutate` is called once per file.

**In the mutation** (`useAiModelUploadMutation` → `uploadAiModelFile`)

4. `onMutate` marks the item `uploading`.
5. **Start:** `POST` the name and model key as JSON with `Upload-Length`. The answer is the model
   artifact id, which is saved on the item.
6. **Chunks:** `file.slice(offset, offset + chunkSize)` is sent as `PATCH .../{artifactId}` with
   `Upload-Offset` and `Upload-Length`, one after the other. After the server confirms a chunk the
   offset moves forward and the progress becomes `offset / size`.
7. **A chunk failed:** wait 500 ms, then 1 s, then 3 s (`AI_MODEL_UPLOAD_CHUNK_RETRY_DELAYS`); before
   each retry `HEAD .../{artifactId}` asks where to continue. A request that does not answer within
   `AI_MODEL_UPLOAD_REQUEST_TIMEOUT_MS` (60 s) counts as failed.
8. **Out of retries:** the mutation fails.
9. **The last chunk is confirmed:** `onSuccess` marks the item `completed` at 100%. Or `onError`
   marks it `failed` with the error: the server's response text, or `Request timed out` /
   `Network error` when no response came back.

**Meanwhile**

10. Every progress update goes to the store, so the dialog, the rows under the bell, the bell's dot
    and the tab title (`45% (1/2) | Page`) all move together.
11. **Time left:** each confirmed chunk also records the bytes on the server and the time
    (`recordProgress`). The upload speed is a moving average of those samples
    (`AI_MODEL_UPLOAD_SPEED_SMOOTHING`), so one slow chunk does not make the estimate jump. Under each
    running upload's bar, `AiModelUploadTimeRemaining` shows the bytes still to send divided by that
    speed, counting down every second between chunks: "Calculating time left…" until the first confirmed chunk,
    then e.g. "About 3 min 20 sec left", and "A few seconds left" at the end.
12. The dialog can be closed at any time; the mutation keeps going. Opened again, it is an empty form
    for the next model, with the running uploads listed on top. Each Upload press is its own
    mutation, so any number of uploads run in parallel.
13. **When an upload ends** the dialog shows "Upload completed" or "The upload failed", with
    **New upload** (back to the form) and, after a failure, **Retry**. Retry **starts over**: it
    `DELETE`s the failed attempt on the server (best effort) and runs the mutation again (steps 4 to 9),
    with a new `POST` and a new artifact id, from 0%. If the network is still down, the retry fails
    again and Retry stays.
    **Clear finished** under the bell removes uploads that are done, and `DELETE`s the failed ones on
    the server.

## Files

```
ai-model-upload/
├── README.md
├── api/          the requests: one fetch per endpoint, and the start + chunk loop
├── components/   every display component, one per file, `export default`
├── constants/    API URLs (the file to change per project), and statuses, sizes, wording
├── hooks/        the form's hook and the TanStack Query mutations
├── models/       TypeScript types
├── schemas/      the Zod schema of the form
├── store/        the Zustand store
├── styles/       the FilePond theme
└── utils/        pure helpers
```

| Folder | File | What it is |
| --- | --- | --- |
| `components/` | `UploadModelButton.tsx` | The entry point: the button and its dialog. |
| | `AiModelUploadDialogContent.tsx`, `AiModelUploadForm.tsx` | The dialog's panel and its form, one block per phase. |
| | `AiModelUploadTextField.tsx` | A labelled input bound to React Hook Form, with its Zod error. |
| | `AiModelUploadDropzone.tsx` | The FilePond drop zone, themed by `styles/ai-model-upload.css`. |
| | `AiModelUploadActionBar.tsx`, `AiModelUploadSubmitButton.tsx`, `AiModelUploadNewUploadButton.tsx`, `AiModelUploadRetryButton.tsx` | The row under the drop zone and its buttons. The Retry button reads the store and starts the mutations itself, remove it to remove retry. |
| | `AiModelUploadInProgressAlert.tsx`, `AiModelUploadInProgressSection.tsx` | "You can close this dialog" alert, and the still-running uploads at the top of a reopened dialog. |
| | `AiModelUploadCompletedMessage.tsx`, `AiModelUploadFailedMessage.tsx`, `AiModelUploadRejectedMessage.tsx` | Result and validation messages. |
| | `AiModelUploadStatusList.tsx`, `AiModelUploadStatusRow.tsx`, `AiModelUploadProgressBar.tsx`, `AiModelUploadTimeRemaining.tsx`, `AiModelUploadStatusEmpty.tsx` | Progress rows: name, model key and file, bar (yellow below 70%, green from 70%, red when failed), and the time left while it runs. |
| | `AiModelUploadStatusOverview.tsx`, `AiModelUploadClearFinishedButton.tsx`, `AiModelUploadActiveIndicator.tsx` | Store-connected pieces for a notifications popover. Clearing also cancels the cleared failed uploads on the server. |
| | `AiModelUploadDocumentTitle.tsx` | Progress in the browser tab title. Mount once. |
| `hooks/` | `useAiModelUpload.ts` | What the form needs: phase, staged files, session, `startUpload`, `endSession`. |
| | `useAiModelUploadMutation.ts`, `useAiModelUploadCancelMutation.ts` | The TanStack Query mutations that upload one file and cancel one on the server. |
| `constants/` | `ai-model-upload-urls.constants.ts` | The API URLs, request headers and credentials. The file to change per project. |
| | `ai-model-upload.constants.ts` | Statuses, phases, chunk size, retries, timeout, speed smoothing, wording. |
| `api/` | `ai-model-upload.api.ts`, `ai-model-upload.uploader.ts` | The four requests, and the start and chunk loop that uses them. |
| `store/` | `ai-model-upload.store.ts` | The Zustand store and its selector hooks. |
| `models/` | `ai-model-upload.models.ts` | Types. |
| `schemas/` | `ai-model-upload.schema.ts` | The Zod schema (also used by the mock to validate the start request). |
| `utils/` | `ai-model-upload.utils.ts` | Phase, progress, chunk size and time-left helpers. |
| `styles/` | `ai-model-upload.css` | FilePond themed with the shadcn CSS variables. |

## The mock

`app/api/ai-models/multipart-upload/route.ts` (start) and `[artifactId]/route.ts` (chunk, resume,
cancel) follow the Swagger, validate the same headers and body, and answer with `AMAR-<uuid>` ids.
Nothing is stored and every upload is stretched to 10 to 15 seconds. The transfers live in memory, so
it only works with a single server process (`next dev`, one `next start`).

## File uploads in general

- **A file in the browser is a `File` object**, a handle to the bytes on disk plus a name, size and
  type. `file.slice()` cuts a piece out of it without reading the rest into memory.
- **Chunking splits one big request into many small ones.** A single request for a 2GB file fails as
  a whole if the connection drops and may exceed the server's body size limit. Chunks avoid both:
  each is small, a failed one is retried alone, and after an interruption the client asks the server
  how far it got (`HEAD`, `Upload-Offset`) and continues from there.
- **The server must not trust the client.** The extension filter in the drop zone is a convenience.
  The backend still checks type and size, requires authentication, and cleans up uploads that were
  never finished.
