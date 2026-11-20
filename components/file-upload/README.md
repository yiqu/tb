# File upload

Composable file upload pieces built on [FilePond](https://pqina.nl/filepond/docs/) and
[react-filepond](https://github.com/pqina/react-filepond). The example that wires them together
lives on the `/test` page (`app/(base)/test/_components/file-upload-demo/`), and it uploads to a
slow mock server at `app/api/filepond-mock/route.ts`. The mock keeps chunk state in the memory of
one process, so it only works with a single server process (`next dev`, one `next start`), not
behind a load balancer or on serverless functions.

## What was built

- **Upload dialog** (example on `/test`, "Upload Files"): a package name field, a FilePond drop zone
  that only accepts `.txt`, the list of staged files, and an Upload button. While files are sent the
  drop zone is replaced by one progress bar per file and an info alert says the dialog can be closed.
  It ends in "Upload completed", or a failed message with **New upload** and **Retry** buttons.
- **Uploads keep running after the dialog closes.** Progress is still visible in three places:
  - the **notifications bell** in the top nav, which gets a pulsing dot while anything is uploading
    and an "Upload Status" section with every batch and a "Clear finished" button
  - the **browser tab title**, e.g. `45% (1/3) | Playground`
  - the dialog itself when it is opened again: still-running batches are listed on top
- **Staged files and the typed package name survive closing the dialog**, so nothing is lost by
  clicking outside it before pressing Upload.
- **Retry** sends only the failed files again. **Chunked uploads** resume from where the server got
  to, and a request that stalls times out.
- **A mock FilePond server** (`app/api/filepond-mock/route.ts`) that is slowed down on purpose
  (10 to 15 seconds per file) so the progress UI can be seen.

Where things live:

| Folder | Contents |
| --- | --- |
| `components/file-upload/` | Every upload piece (drop zone, buttons, status rows, store, uploader). See [Components](#components). |
| `components/notifications/` | The bell popover and its sections. Not upload specific. |
| `components/top-nav/TopNavNotificationsButton.tsx` | The bell with the "Upload Status" section. |
| `app/(base)/BodyParent.tsx` | Mounts `FileUploadDocumentTitle` once for the whole app. |
| `app/(base)/test/_components/file-upload-demo/` | The example dialog and form, and the server config it uses. |
| `validators/file-upload/` | Zod schema for the package name. |
| `app/api/filepond-mock/route.ts` | The mock server. |

## How FilePond fits in

FilePond is used for what it is good at, the **picking** of files, and nothing else:

| Done by FilePond (`FileUploadDropzone`) | Done by this project |
| --- | --- |
| Drag and drop, the Browse button, multiple selection | Keeping the staged `File` objects in the store (`stagedFiles`) |
| The list of staged files with name, size and a remove button | Deciding when to upload (the Upload button) |
| Calling `beforeAddFile`, where the allowed extensions are checked | The "skipped files" message |
| | Sending the files, progress, retry, resume, timeouts (`file-upload.uploader.ts`) |
| | The status of every file, the queue, parallel limits (`file-upload.store.ts`) |
| | Every status view: dialog rows, bell, tab title |

How the drop zone is wired:

- `instantUpload`, `allowProcess`, `allowRevert` are **off** and no `server` option is given, so
  FilePond never sends anything.
- FilePond **owns the list** while it is mounted. On every add or remove it calls `reportFiles`,
  which reads `getFiles()` and hands the `File` objects to the store. The list is not fed back to
  FilePond as a `files` prop, because doing that let rejected files slip back in.
- When the dialog opens again, `oninit` adds the files the store kept with `addFiles`, which is how
  a staged selection survives the dialog closing.
- When the upload starts the store empties `stagedFiles`, and the drop zone clears FilePond with
  `removeFiles()`.
- FilePond has no option for the browse input's `accept` attribute, so it is set by hand
  (`syncAcceptAttribute`), and again after each selection because FilePond replaces that input.
- FilePond is loaded with `next/dynamic` (`ssr: false`) in the form, so it is only downloaded once
  the dialog opens.

### Why FilePond does not do the sending

FilePond can upload by itself: give it a `server` option and it sends the same requests. But it
cancels every running upload when its component unmounts, and the dialog unmounts when it closes.
Since uploads have to keep going after the dialog is closed, the sending is done by the store
instead, outside of React. The uploader speaks **FilePond's own server protocol** (section 1), so
any backend written for FilePond works unchanged, and the drop zone could later be swapped for
FilePond's built-in uploading if that limitation ever goes away.

## 1. URLs your backend needs

Everything is driven by one config object (`FileUploadServerConfig`, see
`file-upload-demo.constants.ts`). Point `url` at your backend and these are the requests it will
receive. `<url>` is that base url, for the mock it is `/api/filepond-mock`.

### Required: process (the upload itself)

| | |
| --- | --- |
| Request | `POST <url>` |
| Body | `multipart/form-data`. The configured `fieldName` (default `filepond`) contains the file and, when metadata is provided, a JSON metadata part before it (here `{"packageName":"..."}`). |
| Response | `200`, `text/plain`, the body is a unique id for the stored file (for example `a1b2c3`). |

That single endpoint is enough to make uploads work. Set `chunkUploads: false` in the config and
nothing else is called.

### Optional: chunked uploads

Only called when `chunkUploads: true`. Worth having for large files, because progress is then
confirmed by the server chunk by chunk and an interrupted upload can be resumed.

| Step | Request | Details | Response |
| --- | --- | --- | --- |
| Start | `POST <url>` | `multipart/form-data` with only the metadata (if any) under `fieldName` (no file). Header `Upload-Length: <file size in bytes>`. | `200`, `text/plain`, a transfer id. |
| Each chunk | `PATCH <url>?patch=<id>` | Body is the raw bytes of the chunk. Headers `Content-Type: application/offset+octet-stream`, `Upload-Offset: <byte offset of this chunk>`, `Upload-Length: <file size>`, `Upload-Name: <percent-encoded file name>`. | `204` (any 2xx). |
| Resume | `HEAD <url>?patch=<id>` | No body. Sent after a chunk failed, before it is retried. | `200` with header `Upload-Offset: <next expected byte offset>`. |

The server tells the two `POST` variants apart by the `Upload-Length` header: present means "start
a chunked transfer", absent means "here is the whole file". When the last chunk arrives the server
assembles the file, and the transfer id is from then on the id of the file.

`Upload-Name` is **always** percent-encoded with `encodeURIComponent`, so the server always decodes
it with `decodeURIComponent` (`notes%20final.txt` -> `notes final.txt`). This differs from FilePond,
which sends the raw name: a header can only hold ISO-8859-1, and deciding by "contains `%`" cannot
tell an encoded name from a raw one such as `100%.txt`.

A failed chunk is retried after each delay in `chunkRetryDelays` (default `[500, 1000, 3000]` ms,
like FilePond). Before each retry the client sends `HEAD` and continues from the `Upload-Offset` the
server answers with. The upload fails once the delays are used up.

### Optional: revert

| | |
| --- | --- |
| Request | `DELETE <url>` |
| Body | The file id as plain text. |
| Response | `204` (empty). |

Removes a file that was uploaded. The UI does not call it yet (`revertUploadedFile` in
`file-upload.uploader.ts` is ready for it), but FilePond clients expect it to exist.

### Changing the paths

If your backend uses separate paths, set `processPath` (default `''`), `patchPath` (default
`'?patch='`) and `revertPath` (default `''`) in the config. For example `url: '/api/files'`, `processPath: '/process'`,
`patchPath: '/patch/'` gives `POST /api/files/process` and `PATCH /api/files/patch/<id>`.
`headers` and `withCredentials` are there for auth.

### Timeouts and parallel uploads

`timeout` (default 60 seconds, `0` waits forever) fails a request that made no upload progress and
got no response for that long. That includes the wait after the body has finished sending, so a
backend that takes longer than `timeout` to process a file before answering also fails the request. It restarts on every progress event, so a large file that
is still moving is not cut off. `maxParallelUploads` (default 2) applies to each batch, so a batch
started while another is running gets its own slots.

## 2. URLs FilePond itself defines

This is FilePond's full server protocol
([docs](https://pqina.nl/filepond/docs/api/server/)). When FilePond's `server` option is a single
string like `'/api'`, it calls:

| Endpoint | Request | Used for | Needed here |
| --- | --- | --- | --- |
| process | `POST /api` | Upload a file, answer with its id. | Yes |
| process (chunks) | `POST /api`, then `PATCH /api?patch=<id>`, `HEAD /api?patch=<id>` | Upload a file in pieces. | Only with `chunkUploads` |
| revert | `DELETE /api` (id in the body) | Undo an upload. | Recommended |
| load | `GET /api?load=<id or file name>` | Show a file that is already stored on the server in the drop zone. Answers with the file and `Content-Disposition: inline; filename="..."`. | No |
| restore | `GET /api?restore=<id>` | Bring back a temporary upload after a page reload. Same response as load. | No |
| fetch | `GET /api?fetch=<url>` | The user dropped a link to a remote file, the server downloads it on their behalf. | No |
| remove | none by default | Delete a stored (not temporary) file. Only exists as a custom function. | No |

FilePond can also be configured with an object per endpoint (`{ url, process: { url, method, headers, ... }, revert, ... }`)
when a backend does not follow these defaults.

FilePond's idea of the flow is two steps: files are uploaded to a **temporary** location and each
gets an id, then the surrounding form is submitted with those ids and the server moves the files to
their final place. If the form is never submitted the server can clean the temporary files up.

## 3. What actually happens during an upload

### In this project, step by step

Using the example dialog (`FILE_UPLOAD_DEMO_SERVER`: chunked, 3 files at a time).

**Before the upload**

1. **The dialog opens.** If the last Upload finished (or nothing was uploaded yet), `endSession()`
   resets the dialog to an empty form. A session with failed files is kept, so its Retry button is
   still there. Files that were only staged are always kept.
2. **The user types a package name** and drops or browses files. FilePond calls `beforeAddFile` for
   each file: anything not `.txt` is refused, and its name goes into the "skipped" message.
3. **FilePond adds the file to its list** and calls `onaddfile`. `reportFiles` copies FilePond's
   current list into the store as `stagedFiles`. The phase becomes `staging` and the Upload button
   shows. Nothing has left the browser yet.
4. **Upload is pressed.** React Hook Form runs the Zod schema on the package name. If it passes,
   `startUpload({ packageName })` is called.

**Starting the batch** (`file-upload.store.ts`, `startUpload`)

5. Every staged file becomes an upload item: `status: 'queued'`, `progress: 0`, all with one new
   `batchId`. The items are put at the top of `uploads`, `stagedFiles` is emptied and
   `sessionBatchId` is set to the new batch, so the dialog switches from the drop zone to the
   progress rows.
6. Each file, with the server config and the metadata, is pushed onto a queue that lives outside
   React state. A copy is also kept in `uploadSources` so a failed file can be sent again later.
7. `runQueuedUploads` starts files while their batch has a free slot (`maxParallelUploads`, here 3).
   A started file is marked `uploading`.

**Sending one file** (`file-upload.uploader.ts`, `uploadFile`)

8. **Chunked or not?** Chunked when `chunkUploads` is on and the file is larger than `chunkSize`
   (or `chunkForce` is on, as in the example). Otherwise it is one request:
   - **One request:** a `FormData` with the metadata JSON and then the file, both under
     `filepond`, is sent as `POST <url>`. Progress follows the browser's upload progress event and is
     held at 99% until the server answers. The answer text is the file's server id.
9. **Chunked, start the transfer:** `POST <url>` with only the metadata and the header
   `Upload-Length: <file size>`. The server answers with a transfer id.
10. **Chunked, send the chunks one after the other:** `file.slice(offset, offset + chunkSize)` is sent
    as `PATCH <url>?patch=<id>` with `Upload-Offset`, `Upload-Length` and `Upload-Name`. After the
    server confirms a chunk, the offset moves forward and the progress becomes `offset / size`.
11. **A chunk failed:** wait (500 ms, then 1 s, then 3 s), ask the server how far it got with
    `HEAD <url>?patch=<id>`, and continue from the `Upload-Offset` it returns. After the third
    retry fails, the file fails.
12. **Stalls:** every request has a watchdog (`timeout`, default 60 s) that restarts on each progress
    event. If nothing moves and no answer comes for that long, the request is aborted and counts as
    failed.
13. **The last chunk is confirmed:** the server puts the file together, and the transfer id is now the
    file's server id.

**After each file**

14. Every progress update is written to the store. Whatever subscribes re-renders: the dialog rows,
    the bell's dot and its "Upload Status" section, and the tab title.
15. **Success:** the item becomes `completed`, `progress: 100`, with `serverId` set, and its copy in
    `uploadSources` is dropped. **Failure:** it becomes `failed` with the error message.
16. Either way the slot is freed and `runQueuedUploads` starts the next queued file.

**When the batch ends**

17. The phase comes from the session's items: `completed` when all are done, `failed` when all are
    done and at least one failed. The dialog shows "Upload completed", or the failed message with:
    - **Retry**, which puts only the failed files back in the queue (from 0%) and goes to step 7
    - **New upload**, which clears the session and brings back the drop zone, keeping the package
      name and leaving the failed files listed under the bell
18. The tab title shows the final state for a few seconds, then goes back to the page title.
19. **Clear finished** under the bell removes every batch that has no file still running.
20. The server ids (`serverId`) are where a real backend takes over. In FilePond's model these ids are
    submitted with the form so the server can move the files from temporary to final storage (see
    below). The example only shows them as completed.

### What FilePond does when it uploads by itself

For reference, with `server: '/api'` FilePond does this per file:

1. Builds a `FormData`, appends the metadata as JSON and then the file, both under the input's name
   (`filepond` by default).
2. Sends it with `XMLHttpRequest` as `POST /api` and listens to `xhr.upload.onprogress` to draw the
   progress indicator.
3. Reads the response text as the file id and stores it in a hidden `<input name="filepond">`, so
   the id is submitted along with the surrounding form.
4. If the user removes the file afterwards, sends `DELETE /api` with that id.

With `chunkUploads: true` step 2 becomes: `POST` with `Upload-Length` to get an id, slice the file
with `file.slice(offset, offset + chunkSize)`, `PATCH` the chunks one after the other, and retry a
failed chunk after the delays in `chunkRetryDelays`.

## 4. File uploads in general

- **A file in the browser is a `File` object.** It comes from an `<input type="file">` or a drop
  event. It is a handle to the bytes on disk plus a name, size and type. It is not read into memory
  until something asks for it.
- **`multipart/form-data` is how files travel in a form.** The request body is split into parts,
  one per field, each with its own headers. That is how one request can carry both text fields
  (the metadata) and binary data (the file). In JavaScript you build it with `FormData`.
- **Progress means bytes sent, not bytes saved.** The browser reports how much of the request body
  it has pushed out. It reaches 100% before the server has finished writing the file, which is why
  a bar can sit at "almost done" for a moment. `fetch` cannot report upload progress, which is why
  upload libraries still use `XMLHttpRequest`.
- **Chunking splits one big request into many small ones.** A single request for a 2GB file fails
  as a whole if the connection drops and may exceed the server's body size limit. Chunks avoid
  both: each is small, a failed one is retried alone, and after an interruption the client asks the
  server how far it got (`HEAD`, `Upload-Offset`) and continues from there.
- **Upload first, attach second.** The common pattern is to store the file in a temporary place,
  answer with an id, and let a later request ("save this package with files a, b, c") make it
  permanent. Uploads can then run in the background and the form stays small.
- **The server must not trust the client.** Extension filters in the drop zone are a convenience.
  The backend still has to check the type and size, generate its own storage names instead of
  using the uploaded name, require authentication, and clean up transfers that were never finished.

## Components

| File | What it is |
| --- | --- |
| `FileUploadDropzone` | FilePond drop zone and staging list. Props: `files`, `onFilesChange`, `allowedExtensions`, `onFileRejected`, `className` (height via an `h-*` class). |
| `FileUploadActionBar`, `FileUploadButton` | The row under the drop zone and the Upload button (spinner while uploading). |
| `FileUploadInProgressAlert` | Info alert for the uploading phase. Wording is in `file-upload.constants.ts`. |
| `FileUploadStatusList`, `FileUploadStatusRow`, `FileUploadProgressBar` | Progress per file. Yellow below 70%, dark green from 70%. |
| `FileUploadInProgressSection` | The uploads still running, for the top of an upload surface that is opened again. Reads the store, renders nothing when idle. |
| `FileUploadRetryButton` | Sends failed files in the current session again by default; pass `scope="all"` to retry failures from every batch. Reads the store and renders nothing when no failed file is in scope. Remove the element to remove the feature. |
| `FileUploadCompletedMessage`, `FileUploadFailedMessage`, `FileUploadRejectedMessage` | Result and validation messages. |
| `FileUploadStatusOverview`, `FileUploadClearFinishedButton`, `FileUploadActiveIndicator` | Store-connected pieces used in the notifications popover. Clear finished removes every batch with no file still running; if that includes the batch an open dialog follows, the dialog starts over. |
| `FileUploadDocumentTitle` | Puts `45% (1/3)` in the browser tab while uploading. Mounted once in `BodyParent`. |
| `useFileUpload` | Hook for an upload surface: phase, staged files, `sessionBatchId`, session uploads, `startUpload`, `endSession`. `sessionBatchId` is the batch the surface follows (null while staging); pass it to `<FileUploadInProgressSection excludeBatchId={ sessionBatchId }>` so the surface's own batch is not listed twice. |
| `file-upload.store.ts`, `file-upload.uploader.ts` | Global upload state and the code that sends the requests. |

To reuse the feature in another project, copy this folder. It depends on `filepond`,
`react-filepond`, `zustand`, `lucide-react`, the shadcn `button`, `progress`, `alert` and `spinner`
components, and the project's `Typography`, `RowStack` and `ColumnStack`.
