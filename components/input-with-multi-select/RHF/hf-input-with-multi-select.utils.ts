/**
 * Pulls the message out of a react-hook-form error for an `InputWithMultiSelectValue` field.
 *
 * The field value is an object, so zod reports its errors on nested keys — the field's own
 * `error.message` stays undefined and shadcn's `FormMessage` would render nothing. Walk the error
 * tree instead: the field's own message first, then whatever is underneath. The walk is generic
 * rather than a hardcoded `input` / `selection` pair, so an error reported deeper (on
 * `selection.display`, say) still reaches the user instead of leaving the field silently red.
 */
const MAX_ERROR_DEPTH = 4;

export const resolveInputWithMultiSelectErrorMessage = (error: unknown, depth: number = 0): string | undefined => {
  if (!error || typeof error !== 'object' || depth > MAX_ERROR_DEPTH) {
    return undefined;
  }

  const errorRecord = error as Record<string, unknown>;
  const ownMessage = errorRecord.message;
  if (typeof ownMessage === 'string' && ownMessage !== '') {
    return ownMessage;
  }

  // `ref` and `type` are react-hook-form bookkeeping, never nested errors.
  const nestedKeys = Object.keys(errorRecord).filter((key: string) => key !== 'ref' && key !== 'type');
  for (const nestedKey of nestedKeys) {
    const nestedMessage = resolveInputWithMultiSelectErrorMessage(errorRecord[nestedKey], depth + 1);
    if (nestedMessage) {
      return nestedMessage;
    }
  }

  return undefined;
};
