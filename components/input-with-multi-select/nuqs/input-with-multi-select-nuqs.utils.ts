import { parseAsTrimmedString } from '@/nuqs-parsers/string.parser';

import { InputWithMultiSelectValue, InputWithMultiSelectSelectOption } from '../input-with-multi-select.models';
import { getTrimmedInput, resolveDefaultOption, createInputWithMultiSelectValue } from '../input-with-multi-select.utils';

/** Parser map handed to `useQueryStates` — one trimmed string parser per option. */
export type InputWithMultiSelectQueryParsers = Record<string, typeof parseAsTrimmedString>;

/** What `useQueryStates` reads back: the current value of every option's query parameter. */
export type InputWithMultiSelectQueryValues = Record<string, string | null>;

/**
 * Turns the option list into the `useQueryStates` key map. Every option owns exactly one
 * query parameter, parsed as a trimmed string (empty string reads back as `null`).
 */
export const buildQueryParsersFromOptions = (options: InputWithMultiSelectSelectOption[]): InputWithMultiSelectQueryParsers => {
  return options.reduce((parsers: InputWithMultiSelectQueryParsers, option: InputWithMultiSelectSelectOption) => {
    parsers[option.queryParam] = parseAsTrimmedString;
    return parsers;
  }, {});
};

/**
 * Reads the value the component should start with off the current query string: the first option
 * that already has a value in the URL wins, otherwise fall back to the passed in defaults.
 * The option asked for by `defaultSelectedOptionId` gets first refusal.
 */
export const resolveValueFromQueryValues = (
  options: InputWithMultiSelectSelectOption[],
  queryValues: InputWithMultiSelectQueryValues,
  defaultSelectedOptionId?: string,
  defaultInputValue?: string,
): InputWithMultiSelectValue => {
  const defaultOption = resolveDefaultOption(options, defaultSelectedOptionId);
  const defaultOptionUrlValue = defaultOption ? queryValues[defaultOption.queryParam] : null;

  if (defaultOption && defaultOptionUrlValue) {
    return createInputWithMultiSelectValue(defaultOptionUrlValue, defaultOption);
  }

  const optionFromUrl = options.find((option: InputWithMultiSelectSelectOption) => !!queryValues[option.queryParam]);
  if (optionFromUrl) {
    return createInputWithMultiSelectValue(queryValues[optionFromUrl.queryParam] ?? '', optionFromUrl);
  }

  return createInputWithMultiSelectValue(defaultInputValue ?? '', defaultOption);
};

/**
 * Builds the patch handed to `setQueryStates` on submit: the selected option's parameter gets the
 * trimmed text (`null` removes it from the URL). When `clearOtherQueryParams` is on, every other
 * parameter owned by the option list is cleared so only one search is ever active.
 */
export const buildQueryPatchFromValue = (
  options: InputWithMultiSelectSelectOption[],
  value: InputWithMultiSelectValue,
  clearOtherQueryParams: boolean,
): Partial<InputWithMultiSelectQueryValues> => {
  if (!value.selection) {
    return {};
  }

  const trimmedInput = getTrimmedInput(value);
  const patch: Partial<InputWithMultiSelectQueryValues> = {};

  if (clearOtherQueryParams) {
    for (const option of options) {
      patch[option.queryParam] = null;
    }
  }

  patch[value.selection.queryParam] = trimmedInput === '' ? null : trimmedInput;
  return patch;
};
