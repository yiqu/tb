import { InputWithMultiSelectValue, InputWithMultiSelectSelectOption } from './input-with-multi-select.models';

/**
 * Finds an option by its id. Returns `null` instead of `undefined` so it lines up with
 * `InputWithMultiSelectValue['selection']`.
 */
export const findOptionById = (options: InputWithMultiSelectSelectOption[], optionId?: string): InputWithMultiSelectSelectOption | null => {
  if (!optionId) {
    return null;
  }
  return options.find((option: InputWithMultiSelectSelectOption) => option.id === optionId) ?? null;
};

/**
 * Resolves the option the component should start with: the requested one when it exists,
 * otherwise the first of the list, otherwise `null` (empty option list).
 */
export const resolveDefaultOption = (
  options: InputWithMultiSelectSelectOption[],
  defaultSelectedOptionId?: string,
): InputWithMultiSelectSelectOption | null => {
  return findOptionById(options, defaultSelectedOptionId) ?? options[0] ?? null;
};

/** Builds a value object. Handy so callers never have to remember the shape. */
export const createInputWithMultiSelectValue = (
  input: string,
  selection: InputWithMultiSelectSelectOption | null,
): InputWithMultiSelectValue => {
  return { input, selection };
};

/**
 * Normalizes anything a form / URL hands us into a usable value, so the component never renders
 * with `undefined`. A missing selection falls back to the default option, but an explicit `null`
 * is kept as is: that is a form saying "nothing is picked yet", and overwriting it would show a
 * selection the form does not actually hold (and hide the validator's "selection is required").
 */
export const normalizeInputWithMultiSelectValue = (
  value: Partial<InputWithMultiSelectValue> | null | undefined,
  options: InputWithMultiSelectSelectOption[],
  defaultSelectedOptionId?: string,
): InputWithMultiSelectValue => {
  const rawSelection = value?.selection;
  const input = value?.input ?? '';

  if (rawSelection === null) {
    return createInputWithMultiSelectValue(input, null);
  }
  if (rawSelection === undefined) {
    return createInputWithMultiSelectValue(input, resolveDefaultOption(options, defaultSelectedOptionId));
  }

  // A selection that is no longer part of `options` (a stale id) falls back to the default.
  return createInputWithMultiSelectValue(input, findOptionById(options, rawSelection.id) ?? resolveDefaultOption(options, defaultSelectedOptionId));
};

/** The trimmed text of a value — what should actually be searched / stored. */
export const getTrimmedInput = (value: InputWithMultiSelectValue): string => {
  return value.input.trim();
};

/** True when the value carries a selection and some non whitespace text. */
export const isInputWithMultiSelectValueSubmittable = (value: InputWithMultiSelectValue): boolean => {
  return value.selection !== null && getTrimmedInput(value) !== '';
};

/** The query parameter the current selection maps to, `null` when nothing is selected. */
export const getSelectedQueryParam = (value: InputWithMultiSelectValue): string | null => {
  return value.selection?.queryParam ?? null;
};

/** Every query parameter covered by an option list. Useful to clear them all at once. */
export const getAllQueryParams = (options: InputWithMultiSelectSelectOption[]): string[] => {
  return options.map((option: InputWithMultiSelectSelectOption) => option.queryParam);
};
