import { NextRequest } from 'next/server';

/**
 * MOCK FilePond server, for the file upload example on the /test page. Nothing is stored: the bytes
 * are counted and thrown away, and every response is slowed down on purpose so an upload takes
 * 10 to 15 seconds and its progress can be watched. Replace it with the real endpoints later.
 *
 * It follows the FilePond server protocol (https://pqina.nl/filepond/docs/api/server/) for a
 * `server` configured as the single url `/api/filepond-mock`:
 *
 * | stage             | request                                 | details                                                                                   |
 * | ----------------- | --------------------------------------- | ----------------------------------------------------------------------------------------- |
 * | process           | `POST   /api/filepond-mock`             | multipart/form-data, field `filepond` twice: metadata JSON, then the file. -> id as text  |
 * | process (chunked) | `POST   /api/filepond-mock`             | multipart/form-data with metadata only + header `Upload-Length`. -> transfer id as text   |
 * | send chunk        | `PATCH  /api/filepond-mock?patch=<id>`  | raw chunk body, headers `Upload-Offset`, `Upload-Length`, `Upload-Name`. -> 204           |
 * | resume chunks     | `HEAD   /api/filepond-mock?patch=<id>`  | -> header `Upload-Offset` with the next expected offset                                   |
 * | revert            | `DELETE /api/filepond-mock`             | body is the id as plain text. -> 204                                                      |
 *
 * Not implemented because the example never calls them (FilePond uses them to show files that are
 * already on the server): `GET ?load=<id>`, `GET ?restore=<id>`, `GET ?fetch=<url>`.
 */

const FIELD_NAME = 'filepond';
const MIN_UPLOAD_DURATION_MS = 10_000;
const MAX_UPLOAD_DURATION_MS = 15_000;

interface MockTransfer {
  /** Total size announced by `Upload-Length`. */
  length: number;
  /** Next expected offset. */
  offset: number;
  name: string | null;
  /** How long this whole upload is stretched out to. */
  durationMs: number;
}

// kept on globalThis so the transfers survive hot reloads of this module in dev
const globalForMock = globalThis as typeof globalThis & { filepondMockTransfers?: Map<string, MockTransfer> };
const transfers: Map<string, MockTransfer> = globalForMock.filepondMockTransfers ?? new Map<string, MockTransfer>();
globalForMock.filepondMockTransfers = transfers;

function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getSlowUploadDurationMs(): number {
  return MIN_UPLOAD_DURATION_MS + Math.random() * (MAX_UPLOAD_DURATION_MS - MIN_UPLOAD_DURATION_MS);
}

function textResponse(body: string | null, status: number, headers?: Record<string, string>): Response {
  return new Response(body, { status, headers: { 'Content-Type': 'text/plain', ...headers } });
}

/** process: either the whole file in one request, or the start of a chunked transfer. */
export async function POST(request: NextRequest) {
  const uploadLength: string | null = request.headers.get('Upload-Length');
  const formData: FormData = await request.formData();
  const id: string = crypto.randomUUID();

  // chunked: no file yet, only the announced size. The chunks follow as PATCH requests.
  if (uploadLength !== null) {
    const length: number = Number(uploadLength);
    if (!Number.isFinite(length) || length < 0) {
      return textResponse('Invalid Upload-Length header', 400);
    }
    transfers.set(id, { length, offset: 0, name: null, durationMs: getSlowUploadDurationMs() });
    return textResponse(id, 200);
  }

  const file: FormDataEntryValue | undefined = formData.getAll(FIELD_NAME).find((entry: FormDataEntryValue) => entry instanceof File);
  if (!(file instanceof File)) {
    return textResponse(`No file was posted under the "${FIELD_NAME}" field`, 400);
  }
  await sleep(getSlowUploadDurationMs());
  return textResponse(id, 200);
}

/** send chunk: `?patch=<id>`. */
export async function PATCH(request: NextRequest) {
  const id: string | null = request.nextUrl.searchParams.get('patch');
  const transfer: MockTransfer | undefined = id === null ? undefined : transfers.get(id);
  if (!transfer) {
    return textResponse('Unknown transfer id', 404);
  }

  const offset: number = Number(request.headers.get('Upload-Offset'));
  if (!Number.isFinite(offset) || offset !== transfer.offset) {
    return textResponse(`Expected Upload-Offset ${transfer.offset}`, 409);
  }

  const chunk: ArrayBuffer = await request.arrayBuffer();
  // every chunk waits for its share of the total duration, so the whole file takes 10 to 15 seconds
  const share: number = transfer.length === 0 ? 1 : chunk.byteLength / transfer.length;
  await sleep(transfer.durationMs * share);

  transfer.offset = offset + chunk.byteLength;
  transfer.name = request.headers.get('Upload-Name');
  // nothing is stored, so a finished transfer is forgotten right away to keep the map from growing
  if (id !== null && transfer.offset >= transfer.length) {
    transfers.delete(id);
  }
  return textResponse(null, 204);
}

/** resume chunks: `?patch=<id>`, answers with the next expected offset. */
export async function HEAD(request: NextRequest) {
  const id: string | null = request.nextUrl.searchParams.get('patch');
  const transfer: MockTransfer | undefined = id === null ? undefined : transfers.get(id);
  if (!transfer) {
    return textResponse(null, 404);
  }
  return textResponse(null, 200, { 'Upload-Offset': String(transfer.offset) });
}

/** revert: the body is the id of the file to remove. */
export async function DELETE(request: NextRequest) {
  const id: string = (await request.text()).trim();
  transfers.delete(id);
  return textResponse(null, 204);
}
