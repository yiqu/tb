import { z } from 'zod';

/** Shape of one dropdown option, mirroring `InputWithMultiSelectSelectOption`. */
export const inputWithMultiSelectSelectOptionSchema = z.object({
  id: z.string().min(1, { message: 'Option id is required' }),
  queryParam: z.string().min(1, { message: 'Option query param is required' }),
  display: z.string().min(1, { message: 'Option display is required' }),
});

/** Inferred type of one dropdown option. */
export type InputWithMultiSelectSelectOptionSchema = z.infer<typeof inputWithMultiSelectSelectOptionSchema>;

export interface InputWithMultiSelectValueSchemaOptions {
  /** Error shown when the dropdown has no selection. */
  selectionRequiredMessage?: string;
  /** Error shown when the input is empty (after trimming). */
  inputRequiredMessage?: string;
  /** Optional upper bound on the trimmed text. */
  maxInputLength?: number;
  /** Error shown when `maxInputLength` is exceeded. */
  maxInputLengthMessage?: string;
}

/**
 * Builds the validator for an `InputWithMultiSelectValue`: a selection has to be made and the
 * text has to hold something once trimmed. Use the factory when the messages (or a max length)
 * need to change per form, otherwise use `inputWithMultiSelectValueSchema` below.
 */
export const createInputWithMultiSelectValueSchema = ({
  selectionRequiredMessage = 'A selection is required',
  inputRequiredMessage = 'A value is required',
  maxInputLength,
  maxInputLengthMessage,
}: InputWithMultiSelectValueSchemaOptions = {}) => {
  const inputSchema = z
    .string({ required_error: inputRequiredMessage })
    .trim()
    .min(1, { message: inputRequiredMessage });

  return z.object({
    // Same shape, re-created with the error params so a field whose value never carried a
    // `selection` key reports `selectionRequiredMessage` instead of zod's bare "Required".
    // Reusing `.shape` keeps this in step with the exported option schema, and the resulting
    // output type stays `option | null` so `FieldPathByValue` still matches the value interface.
    selection: z
      .object(inputWithMultiSelectSelectOptionSchema.shape, {
        required_error: selectionRequiredMessage,
        invalid_type_error: selectionRequiredMessage,
      })
      .nullable()
      // Annotated as `boolean` on purpose: an inferred type predicate would narrow the parsed
      // output to a non-null selection, which no longer lines up with `InputWithMultiSelectValue`
      // (and forces every react-hook-form consumer to juggle a separate transformed type).
      .refine((selection: InputWithMultiSelectSelectOptionSchema | null): boolean => selection !== null, {
        message: selectionRequiredMessage,
      }),
    input:
      maxInputLength === undefined ? inputSchema : (
        inputSchema.max(maxInputLength, { message: maxInputLengthMessage ?? `Must be ${maxInputLength} characters or fewer` })
      ),
  });
};

/** Ready to use validator with the default messages. */
export const inputWithMultiSelectValueSchema = createInputWithMultiSelectValueSchema();

/** Inferred type — structurally the same as `InputWithMultiSelectValue`. */
export type InputWithMultiSelectValueSchema = z.infer<typeof inputWithMultiSelectValueSchema>;
