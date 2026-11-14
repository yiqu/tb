# File upload

Composable file upload pieces built on [FilePond](https://pqina.nl/filepond/docs/) and
[react-filepond](https://github.com/pqina/react-filepond). The example that wires them together
lives on the `/test` page (`app/(base)/test/_components/file-upload-demo/`), and it uploads to a
slow mock server at `app/api/filepond-mock/route.ts`.

## 1. URLs your backend needs

Everything is driven by one config object (`FileUploadServerConfig`, see
`file-upload-demo.constants.ts`). Point `url` at your backend and these are the requests it will
receive. `<url>` is that base url, for the mock it is `/api/filepond-mock`.

### Required: process (the upload itself)

| | |
| --- | --- |
| Request | `POST <url>` |
| Body | `multipart/form-data`. The field `filepond` appears twice: first a JSON string with the metadata (here `{"packageName":"..."}`), then the file. |
| Response | `200`, `text/plain`, the body is a unique id for the stored file (for example `a1b2c3`). |

That single endpoint is enough to make uploads work. Set `chunkUploads: false` in the config and
nothing else is called.

### Optional: chunked uploads

Only called when `chunkUploads: true`. Worth having for large files, because progress is then
confirmed by the server chunk by chunk and an interrupted upload can be resumed.

| Step | Request | Details | Response |
| --- | --- | --- | --- |
| Start | `POST <url>` | `multipart/form-data` with only the metadata under `filepond` (no file). Header `Upload-Length: <file size in bytes>`. | `200`, `text/plain`, a transfer id. |
| Each chunk | `PATCH <url>?patch=<id>` | Body is the raw bytes of the chunk. Headers `Content-Type: application/offset+octet-stream`, `Upload-Offset: <byte offset of this chunk>`, `Upload-Length: <file size>`, `Upload-Name: <file name>`. | `204` (any 2xx). |
| Resume | `HEAD <url>?patch=<id>` | No body. | `200` with header `Upload-Offset: <next expected byte offset>`. |

The server tells the two `POST` variants apart by the `Upload-Length` header: present means "start
a chunked transfer", absent means "here is the whole file". When the last chunk arrives the server
assembles the file, and the transfer id is from then on the id of the file.

`Upload-Name` is the raw file name, like FilePond sends it. If the name has characters that cannot
go in a header (outside ISO-8859-1), or contains `%` itself, it is percent-encoded instead, so decode
it on the server if it contains `%`.

### Optional: revert

| | |
| --- | --- |
| Request | `DELETE <url>` |
| Body | The file id as plain text. |
| Response | `204` (empty). |

Removes a file that was uploaded. The UI does not call it yet (`revertUploadedFile` in
`file-upload.uploader.ts` is ready for it), but FilePond clients expect it to exist.

### Changing the paths

If your backend uses separate paths, set `processPath` (default `''`) and `patchPath` (default
`'?patch='`) in the config. For example `url: '/api/files'`, `processPath: '/process'`,
`patchPath: '/patch/'` gives `POST /api/files/process` and `PATCH /api/files/patch/<id>`.
`headers` and `withCredentials` are there for auth.

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

### In this project

1. **Staging.** `<FileUploadDropzone>` renders FilePond with `instantUpload` and `allowProcess`
   off. FilePond handles drag and drop, the Browse button, and the list of selected files. Nothing
   leaves the browser. The selected `File` objects are kept in a Zustand store
   (`file-upload.store.ts`) so they survive the dialog closing.
2. **Upload is pressed.** `startUpload` turns the staged files into a batch of upload items
   (`queued`, 0%), empties the staging list and puts them in a queue. At most `maxParallelUploads`
   run at once.
3. **Each file is sent** by `file-upload.uploader.ts` with `XMLHttpRequest`, using the requests
   from section 1. Without chunking it is one `POST`, and progress comes from the browser's upload
   progress event (bytes handed to the network). With chunking it is one `POST` to get an id, then
   one `PATCH` per chunk, and progress moves each time the server confirms a chunk.
4. **Progress is written to the store** on every update. Anything subscribed re-renders: the rows
   in the dialog, the rows in the notifications popover, the dot on the bell, and the tab title.
5. **Done.** The server's id is saved on the item as `serverId` and its status becomes `completed`,
   or `failed` with the error message.

### Why FilePond does not do the sending here

FilePond can upload by itself: give it a `server` option and it does steps 3 to 5 internally with
the same requests. But it cancels every running upload when its component unmounts, and the dialog
unmounts when it closes. Since uploads have to keep going after the dialog is closed, the sending
is done by the store instead, speaking FilePond's protocol so any FilePond-compatible backend
works unchanged.

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
| `FileUploadRetryButton` | Sends the failed files again. Reads the store, renders nothing when no file failed. Remove the element to remove the feature. |
| `FileUploadCompletedMessage`, `FileUploadFailedMessage`, `FileUploadRejectedMessage` | Result and validation messages. |
| `FileUploadStatusOverview`, `FileUploadClearFinishedButton`, `FileUploadActiveIndicator` | Store-connected pieces used in the notifications popover. |
| `FileUploadDocumentTitle` | Puts `45% (1/3)` in the browser tab while uploading. Mounted once in `BodyParent`. |
| `useFileUpload` | Hook for an upload surface: phase, staged files, session uploads, `startUpload`, `endSession`. |
| `file-upload.store.ts`, `file-upload.uploader.ts` | Global upload state and the code that sends the requests. |

To reuse the feature in another project, copy this folder. It depends on `filepond`,
`react-filepond`, `zustand`, `lucide-react`, the shadcn `button`, `progress`, `alert` and `spinner`
components, and the project's `Typography`, `RowStack` and `ColumnStack`.
