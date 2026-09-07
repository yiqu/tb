/**
 * Pulls the message out of a react-hook-form error for an `InputWithMultiSelectValue` field.
 *
 * The field value is an object, so zod reports its errors on the nested `input` / `selection`
 * keys — the field's own `error.message` stays undefined and shadcn's `FormMessage` would render
 * nothing. Walk the object instead: the field's own message first, then the nested ones.
 */
export const resolveInputWithMultiSelectErrorMessage = (error: unknown): string | undefined => {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const errorRecord = error as Record<string, unknown>;
  const ownMessage = errorRecord.message;
  if (typeof ownMessage === 'string' && ownMessage !== '') {
    return ownMessage;
  }

  const nestedKeys = ['input', 'selection'] as const;
  for (const nestedKey of nestedKeys) {
    const nestedError = errorRecord[nestedKey];
    if (nestedError && typeof nestedError === 'object') {
      const nestedMessage = (nestedError as Record<string, unknown>).message;
      if (typeof nestedMessage === 'string' && nestedMessage !== '') {
        return nestedMessage;
      }
    }
  }

  return undefined;
};
