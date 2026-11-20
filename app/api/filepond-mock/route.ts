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
 *
 * Limits of a mock, which a real backend must not copy:
 * - The chunk state lives in the memory of one server process. It only works with a single process
 *   (`next dev`, one `next start`). Behind a load balancer or on serverless functions a PATCH can reach
 *   another instance and fail with "Unknown transfer id"; a real backend keeps transfers in shared storage.
 * - The state is bounded: at most `MAX_TRANSFERS` transfers are kept, and a transfer is forgotten
 *   `TRANSFER_TTL_MS` after its last request, finished or not.
 * - Request bodies are read with a byte limit, so an oversized request is cut off instead of being buffered.
 */

const FIELD_NAME = 'filepond';
const MIN_UPLOAD_DURATION_MS = 10_000;
const MAX_UPLOAD_DURATION_MS = 15_000;

/** Largest file the mock accepts. */
const MAX_FILE_BYTES = 50 * 1024 * 1024;
/** Room for the multipart boundaries and the metadata part of a POST. */
const MAX_MULTIPART_OVERHEAD_BYTES = 64 * 1024;
/** A DELETE body is only an id. */
const MAX_REVERT_BODY_BYTES = 1024;

/** How many transfers are kept at most; the least recently used are dropped first. */
const MAX_TRANSFERS = 500;
/**
 * A transfer is forgotten this long after its last request. Long enough to cover the slowest chunk,
 * and it keeps a finished transfer around for FilePond's final zero-byte PATCH (sent when the file
 * size is an exact multiple of the chunk size).
 */
const TRANSFER_TTL_MS = 10 * 60 * 1000;

interface MockTransfer {
  /** Total size announced by `Upload-Length`. */
  length: number;
  /** Next expected offset. */
  offset: number;
  name: string | null;
  /** How long this whole upload is stretched out to. */
  durationMs: number;
  /** Last time a request touched this transfer, for expiry. */
  touchedAt: number;
}

// kept on globalThis so the transfers survive hot reloads of this module in dev
const globalForMock = globalThis as typeof globalThis & { filepondMockTransfers?: Map<string, MockTransfer> };
const transfers: Map<string, MockTransfer> = globalForMock.filepondMockTransfers ?? new Map<string, MockTransfer>();
globalForMock.filepondMockTransfers = transfers;

class BodyTooLargeError extends Error {
  constructor(limit: number) {
    super(`Request body is larger than ${limit} bytes`);
    this.name = 'BodyTooLargeError';
  }
}

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

/** Drops expired transfers, then the least recently used ones until there is room for one more. */
function pruneTransfers(): void {
  const now: number = Date.now();
  transfers.forEach((transfer: MockTransfer, id: string) => {
    if (now - transfer.touchedAt > TRANSFER_TTL_MS) {
      transfers.delete(id);
    }
  });
  // a Map iterates in insertion order and touched transfers are re-inserted, so the first key is the least recently used
  while (transfers.size >= MAX_TRANSFERS) {
    const oldestId: string | undefined = transfers.keys().next().value;
    if (oldestId === undefined) {
      return;
    }
    transfers.delete(oldestId);
  }
}

/** Returns the live transfer and marks it as used, or undefined when it is unknown or expired. */
function getTransfer(id: string | null): MockTransfer | undefined {
  const transfer: MockTransfer | undefined = id === null ? undefined : transfers.get(id);
  if (!transfer || id === null) {
    return undefined;
  }
  if (Date.now() - transfer.touchedAt > TRANSFER_TTL_MS) {
    transfers.delete(id);
    return undefined;
  }
  transfer.touchedAt = Date.now();
  transfers.delete(id);
  transfers.set(id, transfer);
  return transfer;
}

/** Reads the whole body but stops with `BodyTooLargeError` as soon as it passes `limit` bytes. */
async function readBodyWithLimit(request: NextRequest, limit: number): Promise<Uint8Array<ArrayBuffer>> {
  const declaredLength: number = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(declaredLength) && declaredLength > limit) {
    throw new BodyTooLargeError(limit);
  }
  if (!request.body) {
    return new Uint8Array(new ArrayBuffer(0));
  }

  const reader = request.body.getReader();
  const parts: Uint8Array[] = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    received += value.byteLength;
    if (received > limit) {
      await reader.cancel();
      throw new BodyTooLargeError(limit);
    }
    parts.push(value);
  }

  const body = new Uint8Array(new ArrayBuffer(received));
  let position = 0;
  parts.forEach((part: Uint8Array) => {
    body.set(part, position);
    position += part.byteLength;
  });
  return body;
}

function tooLargeResponse(error: unknown): Response | null {
  return error instanceof BodyTooLargeError ? textResponse(error.message, 413) : null;
}

/** The client percent-encodes `Upload-Name` (see the README), a malformed value is kept as it is. */
function decodeUploadName(value: string | null): string | null {
  if (value === null) {
    return null;
  }
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** process: either the whole file in one request, or the start of a chunked transfer. */
export async function POST(request: NextRequest) {
  const uploadLength: string | null = request.headers.get('Upload-Length');

  // chunked: no file yet, only the announced size. The chunks follow as PATCH requests.
  if (uploadLength !== null) {
    const length: number = Number(uploadLength);
    if (!Number.isSafeInteger(length) || length < 0) {
      return textResponse('Invalid Upload-Length header', 400);
    }
    if (length > MAX_FILE_BYTES) {
      return textResponse(`File is larger than ${MAX_FILE_BYTES} bytes`, 413);
    }
    try {
      // only the metadata is posted here, read it to drain the request but keep it small
      await readBodyWithLimit(request, MAX_MULTIPART_OVERHEAD_BYTES);
    } catch (error: unknown) {
      return tooLargeResponse(error) ?? textResponse('Could not read the request body', 400);
    }
    pruneTransfers();
    const id: string = crypto.randomUUID();
    transfers.set(id, { length, offset: 0, name: null, durationMs: getSlowUploadDurationMs(), touchedAt: Date.now() });
    return textResponse(id, 200);
  }

  let formData: FormData;
  try {
    const body: Uint8Array<ArrayBuffer> = await readBodyWithLimit(request, MAX_FILE_BYTES + MAX_MULTIPART_OVERHEAD_BYTES);
    // parse the bytes that were read, with the original boundary
    formData = await new Response(body, { headers: { 'Content-Type': request.headers.get('Content-Type') ?? '' } }).formData();
  } catch (error: unknown) {
    return tooLargeResponse(error) ?? textResponse('Expected a multipart/form-data body', 400);
  }

  const file: FormDataEntryValue | undefined = formData.getAll(FIELD_NAME).find((entry: FormDataEntryValue) => entry instanceof File);
  if (!(file instanceof File)) {
    return textResponse(`No file was posted under the "${FIELD_NAME}" field`, 400);
  }
  // the body limit above includes the multipart envelope, so check the file itself as the chunked path does
  if (file.size > MAX_FILE_BYTES) {
    return textResponse(`File is larger than ${MAX_FILE_BYTES} bytes`, 413);
  }
  await sleep(getSlowUploadDurationMs());
  // nothing is stored and nothing follows a single-request upload, so it gets an id but no transfer record
  return textResponse(crypto.randomUUID(), 200);
}

/** send chunk: `?patch=<id>`. */
export async function PATCH(request: NextRequest) {
  const transfer: MockTransfer | undefined = getTransfer(request.nextUrl.searchParams.get('patch'));
  if (!transfer) {
    return textResponse('Unknown transfer id', 404);
  }

  const offset: number = Number(request.headers.get('Upload-Offset'));
  if (!Number.isSafeInteger(offset) || offset !== transfer.offset) {
    return textResponse(`Expected Upload-Offset ${transfer.offset}`, 409);
  }

  let chunk: Uint8Array;
  try {
    // a chunk may not run past the size announced when the transfer started
    chunk = await readBodyWithLimit(request, transfer.length - offset);
  } catch (error: unknown) {
    if (error instanceof BodyTooLargeError) {
      return textResponse(`Chunk runs past Upload-Length ${transfer.length}`, 413);
    }
    return textResponse('Could not read the chunk', 400);
  }

  // every chunk waits for its share of the total duration, so the whole file takes 10 to 15 seconds
  const share: number = transfer.length === 0 ? 1 : chunk.byteLength / transfer.length;
  await sleep(transfer.durationMs * share);

  transfer.offset = offset + chunk.byteLength;
  transfer.name = decodeUploadName(request.headers.get('Upload-Name'));
  transfer.touchedAt = Date.now();
  // a finished transfer is kept until it expires, FilePond may still send a final zero-byte PATCH
  return textResponse(null, 204);
}

/** resume chunks: `?patch=<id>`, answers with the next expected offset. */
export async function HEAD(request: NextRequest) {
  const transfer: MockTransfer | undefined = getTransfer(request.nextUrl.searchParams.get('patch'));
  if (!transfer) {
    return textResponse(null, 404);
  }
  return textResponse(null, 200, { 'Upload-Offset': String(transfer.offset) });
}

/** revert: the body is the id of the file to remove. */
export async function DELETE(request: NextRequest) {
  let id: string;
  try {
    id = new TextDecoder().decode(await readBodyWithLimit(request, MAX_REVERT_BODY_BYTES)).trim();
  } catch (error: unknown) {
    return tooLargeResponse(error) ?? textResponse('Could not read the request body', 400);
  }
  transfers.delete(id);
  return textResponse(null, 204);
}
