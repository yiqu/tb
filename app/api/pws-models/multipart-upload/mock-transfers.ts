import { NextRequest } from 'next/server';

/**
 * Shared state and helpers of the MOCK PWS model multipart upload API (`route.ts` next to this file and
 * `[artifactId]/route.ts`), used by the "Upload Model" demo on the /test page. It sits at the same paths
 * as the real API, so `components/pws-model-upload/constants/pws-model-upload-urls.constants.ts` holds the real paths. Nothing is stored: the
 * bytes are counted and thrown away, and every chunk is slowed down on purpose so an upload takes
 * 10 to 15 seconds and its progress can be watched.
 *
 * It mirrors the real API's Swagger (see `components/pws-model-upload/README.md`):
 *
 * | step   | request                                                   | details                                                                  |
 * | ------ | --------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | start  | `POST   /api/pws-models/multipart-upload`                  | JSON `{ name, modelKey }`, header `Upload-Length`. -> `AMAR-<uuid>` as text |
 * | chunk  | `PATCH  /api/pws-models/multipart-upload/<id>`             | raw chunk, headers `Upload-Offset`, `Upload-Length`. -> 204               |
 * | resume | `HEAD   /api/pws-models/multipart-upload/<id>`             | header `Upload-Length`. -> header `Upload-Offset`                         |
 * | cancel | `DELETE /api/pws-models/multipart-upload/<id>`             | header `Upload-Length`. -> 204                                            |
 *
 * Limits of a mock, which a real backend must not copy:
 * - The transfers live in the memory of one server process. It only works with a single process
 *   (`next dev`, one `next start`). Behind a load balancer or on serverless functions a PATCH can reach
 *   another instance and fail with "Unknown artifact id"; a real backend keeps transfers in shared storage.
 * - The state is bounded: at most `MAX_TRANSFERS` transfers are kept, and a transfer is forgotten
 *   `TRANSFER_TTL_MS` after its last request, finished or not.
 * - Request bodies are read with a byte limit, so an oversized request is cut off instead of being buffered.
 */

const MIN_UPLOAD_DURATION_MS = 10_000;
const MAX_UPLOAD_DURATION_MS = 15_000;

/** The real API's `Upload-Length` maximum (5 TiB). The mock throws the bytes away, so it accepts the same. */
export const MAX_UPLOAD_LENGTH = 5_497_558_138_880;
/** Largest chunk the mock reads in one PATCH, so a request never buffers more than this. */
export const MAX_CHUNK_BYTES = 10 * 1024 * 1024;
/** The start request only carries `{ name, modelKey }`. */
export const MAX_START_BODY_BYTES = 64 * 1024;
/** Same prefix as the real API's model artifact ids. */
const ARTIFACT_ID_PREFIX = 'AMAR-';

/** How many transfers are kept at most; the least recently used are dropped first. */
const MAX_TRANSFERS = 500;
/** A transfer is forgotten this long after its last request. Long enough to cover the slowest chunk. */
const TRANSFER_TTL_MS = 10 * 60 * 1000;

export interface MockTransfer {
  /** Total size announced by `Upload-Length`. */
  length: number;
  /** Next expected offset. */
  offset: number;
  name: string;
  modelKey: string;
  /** How long this whole upload is stretched out to. */
  durationMs: number;
  /** Last time a request touched this transfer, for expiry. */
  touchedAt: number;
}

// kept on globalThis: both route files share it, and it survives hot reloads in dev
const globalForMock = globalThis as typeof globalThis & { pwsModelUploadMockTransfers?: Map<string, MockTransfer> };
const transfers: Map<string, MockTransfer> = globalForMock.pwsModelUploadMockTransfers ?? new Map<string, MockTransfer>();
globalForMock.pwsModelUploadMockTransfers = transfers;

export class BodyTooLargeError extends Error {
  constructor(limit: number) {
    super(`Request body is larger than ${limit} bytes`);
    this.name = 'BodyTooLargeError';
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function textResponse(body: string | null, status: number, headers?: Record<string, string>): Response {
  return new Response(body, { status, headers: { 'Content-Type': 'text/plain', ...headers } });
}

export function tooLargeResponse(error: unknown): Response | null {
  return error instanceof BodyTooLargeError ? textResponse(error.message, 413) : null;
}

/** Reads a non-negative integer header, or null when it is missing or not one. */
export function readIntegerHeader(request: NextRequest, name: string): number | null {
  const value: string = request.headers.get(name)?.trim() ?? '';
  const parsed: number = value === '' ? Number.NaN : Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
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

/** Starts a transfer and returns its model artifact id. */
export function createTransfer(length: number, name: string, modelKey: string): string {
  pruneTransfers();
  const id: string = `${ARTIFACT_ID_PREFIX}${crypto.randomUUID()}`;
  const durationMs: number = MIN_UPLOAD_DURATION_MS + Math.random() * (MAX_UPLOAD_DURATION_MS - MIN_UPLOAD_DURATION_MS);
  transfers.set(id, { length, offset: 0, name, modelKey, durationMs, touchedAt: Date.now() });
  return id;
}

/** Returns the live transfer and marks it as used, or undefined when it is unknown or expired. */
export function getTransfer(id: string): MockTransfer | undefined {
  const transfer: MockTransfer | undefined = transfers.get(id);
  if (!transfer) {
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

export function deleteTransfer(id: string): void {
  transfers.delete(id);
}

/** Reads the whole body but stops with `BodyTooLargeError` as soon as it passes `limit` bytes. */
export async function readBodyWithLimit(request: NextRequest, limit: number): Promise<Uint8Array<ArrayBuffer>> {
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
