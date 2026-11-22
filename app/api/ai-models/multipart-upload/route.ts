import { NextRequest } from 'next/server';

import { aiModelUploadSchema } from '@/components/ai-model-upload/schemas/ai-model-upload.schema';

import { textResponse, createTransfer, tooLargeResponse, readIntegerHeader, readBodyWithLimit, MAX_UPLOAD_LENGTH, MAX_START_BODY_BYTES } from './mock-transfers';

/** MOCK of `POST /api/ai-models/multipart-upload/` (multipart model upload start), see `mock-transfers.ts`. */
export async function POST(request: NextRequest) {
  const length: number | null = readIntegerHeader(request, 'Upload-Length');
  if (length === null) {
    return textResponse('The Upload-Length header is required', 400);
  }
  if (length > MAX_UPLOAD_LENGTH) {
    return textResponse(`Upload-Length must be at most ${MAX_UPLOAD_LENGTH}`, 413);
  }
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) {
    return textResponse('Expected an application/json body', 415);
  }

  let json: unknown;
  try {
    json = JSON.parse(new TextDecoder().decode(await readBodyWithLimit(request, MAX_START_BODY_BYTES)));
  } catch (error: unknown) {
    return tooLargeResponse(error) ?? textResponse('Expected a JSON body', 400);
  }
  const parsed = aiModelUploadSchema.safeParse(json);
  if (!parsed.success) {
    return textResponse(parsed.error.issues.map((issue) => {
      return `${issue.path.join('.')}: ${issue.message}`;
    }).join('\n'), 400);
  }

  return textResponse(createTransfer(length, parsed.data.name, parsed.data.modelKey), 200);
}
