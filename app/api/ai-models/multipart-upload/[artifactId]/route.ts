import { NextRequest } from 'next/server';

import {
  sleep,
  getTransfer,
  textResponse,
  deleteTransfer,
  MAX_CHUNK_BYTES,
  readIntegerHeader,
  readBodyWithLimit,
  BodyTooLargeError,
} from '../mock-transfers';

import type { MockTransfer } from '../mock-transfers';

interface ArtifactRouteContext {
  params: Promise<{ artifactId: string }>;
}

/** Finds the transfer and checks `Upload-Length` against it. Answers with the error response when that fails. */
async function getCheckedTransfer(request: NextRequest, context: ArtifactRouteContext): Promise<{ id: string; transfer: MockTransfer } | Response> {
  const { artifactId } = await context.params;
  const transfer: MockTransfer | undefined = getTransfer(artifactId);
  if (!transfer) {
    return textResponse('Unknown artifact id', 404);
  }
  const length: number | null = readIntegerHeader(request, 'Upload-Length');
  if (length === null) {
    return textResponse('The Upload-Length header is required', 400);
  }
  if (length !== transfer.length) {
    return textResponse(`Upload-Length ${length} does not match the started upload (${transfer.length})`, 400);
  }
  return { id: artifactId, transfer };
}

/** MOCK of `PATCH /api/ai-models/multipart-upload/{artifactId}`: one chunk at `Upload-Offset`. */
export async function PATCH(request: NextRequest, context: ArtifactRouteContext) {
  const checked = await getCheckedTransfer(request, context);
  if (checked instanceof Response) {
    return checked;
  }
  const { transfer } = checked;

  const offset: number | null = readIntegerHeader(request, 'Upload-Offset');
  if (offset === null || offset !== transfer.offset) {
    return textResponse(`Expected Upload-Offset ${transfer.offset}`, 409);
  }

  let chunk: Uint8Array;
  try {
    // a chunk may not run past the size announced at the start, nor be larger than the mock reads at once
    chunk = await readBodyWithLimit(request, Math.min(MAX_CHUNK_BYTES, transfer.length - offset));
  } catch (error: unknown) {
    if (error instanceof BodyTooLargeError) {
      return textResponse(`Chunk runs past Upload-Length ${transfer.length} or is larger than ${MAX_CHUNK_BYTES} bytes`, 413);
    }
    return textResponse('Could not read the chunk', 400);
  }

  // every chunk waits for its share of the total duration, so the whole file takes 10 to 15 seconds
  const share: number = transfer.length === 0 ? 1 : chunk.byteLength / transfer.length;
  await sleep(transfer.durationMs * share);

  transfer.offset = offset + chunk.byteLength;
  transfer.touchedAt = Date.now();
  // a finished transfer is kept until it expires, so a HEAD after the last chunk still answers
  return textResponse(null, 204);
}

/** MOCK of `HEAD /api/ai-models/multipart-upload/{artifactId}`: the offset of an upload in progress. */
export async function HEAD(request: NextRequest, context: ArtifactRouteContext) {
  const checked = await getCheckedTransfer(request, context);
  if (checked instanceof Response) {
    // a HEAD response has no body, only the status
    return textResponse(null, checked.status);
  }
  return textResponse(null, 200, { 'Upload-Offset': String(checked.transfer.offset) });
}

/** MOCK of `DELETE /api/ai-models/multipart-upload/{artifactId}`: stops a multipart upload. */
export async function DELETE(request: NextRequest, context: ArtifactRouteContext) {
  const checked = await getCheckedTransfer(request, context);
  if (checked instanceof Response) {
    return checked;
  }
  deleteTransfer(checked.id);
  return textResponse(null, 204);
}
