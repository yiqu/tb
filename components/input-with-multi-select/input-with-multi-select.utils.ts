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
 * with `undefined`.
 *
 * A selection that is absent — `null` or `undefined` — stays absent. Rendering the default option
 * instead would show a selection the form does not actually hold: validation would then fail under
 * a control that looks completely filled in, and the only cure would be re-picking the option
 * already on screen. In react-hook-form the form owns its defaults, so a starting selection
 * belongs in `defaultValues`, not in something this component writes behind the form's back.
 */
export const normalizeInputWithMultiSelectValue = (
  value: Partial<InputWithMultiSelectValue> | null | undefined,
  options: InputWithMultiSelectSelectOption[],
  defaultSelectedOptionId?: string,
): InputWithMultiSelectValue => {
  const rawSelection = value?.selection;
  const input = value?.input ?? '';

  if (rawSelection === null || rawSelection === undefined) {
    return createInputWithMultiSelectValue(input, null);
  }

  // A selection that is no longer part of `options` (a stale id) falls back to the default.
  return createInputWithMultiSelectValue(input, findOptionById(options, rawSelection.id) ?? resolveDefaultOption(options, defaultSelectedOptionId));
};

/** The trimmed text of a value — what should actually be searched / stored. */
export const getTrimmedInput = (value: InputWithMultiSelectValue): string => {
  return value.input.trim();
};
