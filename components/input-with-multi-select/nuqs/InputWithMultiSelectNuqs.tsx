'use client';

import { Options, useQueryStates } from 'nuqs';
import { useMemo, useState } from 'react';

import InputWithMultiSelect from '../InputWithMultiSelect';
import { InputWithMultiSelectProps, InputWithMultiSelectValue } from '../input-with-multi-select.models';
import { createInputWithMultiSelectValue, resolveDefaultOption } from '../input-with-multi-select.utils';
import { buildQueryPatchFromValue, buildQueryParsersFromOptions, resolveValueFromQueryValues } from './input-with-multi-select-nuqs.utils';

export interface InputWithMultiSelectNuqsProps extends Omit<InputWithMultiSelectProps, 'value' | 'onValueChange'> {
  /**
   * nuqs options spread onto `useQueryStates` — `history`, `scroll`, `shallow`, `throttleMs`,
   * `limitUrlUpdates`, `clearOnDefault`, `startTransition`.
   */
  nuqsOptions?: Options;
  /**
   * Clear the query parameters of the other options when submitting, so only the selected
   * option's parameter stays in the URL. Defaults to `true`.
   */
  clearOtherQueryParams?: boolean;
  /**
   * Seed the selection / text from the query string on mount. Defaults to `true`.
   * Later external URL changes (back / forward) are not mirrored back into the input.
   */
  syncFromUrlOnMount?: boolean;
  /**
   * Write to the URL as soon as the dropdown selection changes, without waiting for a submit.
   * Defaults to `false` — the plain component treats a selection change as "not a submit".
   * With `clearOtherQueryParams` on, this moves the current text onto the newly selected
   * option's parameter and drops the previous one.
   */
  updateQueryOnSelectionChange?: boolean;
  /**
   * Write to the URL on every keystroke instead of only on submit. Defaults to `false`.
   * URL writes stay rate limited by nuqs, so `throttleMs` / `limitUrlUpdates` in `nuqsOptions`
   * decide how often the address bar actually changes while typing.
   */
  updateQueryOnInputChange?: boolean;
}

/**
 * `InputWithMultiSelect` wired to the URL: submitting (Enter, the trigger icon, or the clear
 * button) writes the trimmed text to the query parameter of whichever option is selected —
 * `queryParam` on `InputWithMultiSelectSelectOption` decides the key.
 *
 * `updateQueryOnSelectionChange` and `updateQueryOnInputChange` widen what counts as a submit
 * here, so a dropdown change or a keystroke can drive the URL too.
 *
 * Requires a nuqs adapter above it (this app mounts `NuqsAdapter` in the layout).
 */
export default function InputWithMultiSelectNuqs({
  options,
  defaultSelectedOptionId,
  defaultInputValue,
  nuqsOptions,
  clearOtherQueryParams = true,
  syncFromUrlOnMount = true,
  updateQueryOnSelectionChange = false,
  updateQueryOnInputChange = false,
  onChange,
  ...rest
}: InputWithMultiSelectNuqsProps) {
  const parsers = useMemo(() => buildQueryParsersFromOptions(options), [options]);
  const [queryValues, setQueryValues] = useQueryStates(parsers, nuqsOptions);

  // The URL is only read on mount: mirroring it back on every render would fight the user's
  // typing whenever the URL update is throttled or goes through the server (`shallow: false`).
  const [value, setValue] = useState<InputWithMultiSelectValue>(() => {
    if (syncFromUrlOnMount) {
      return resolveValueFromQueryValues(options, queryValues, defaultSelectedOptionId, defaultInputValue);
    }
    return createInputWithMultiSelectValue(defaultInputValue ?? '', resolveDefaultOption(options, defaultSelectedOptionId));
  });

  const handleOnSubmit = (submittedValue: InputWithMultiSelectValue) => {
    // nuqs rate limits the write itself, so a keystroke driven caller still honours throttleMs.
    setQueryValues(buildQueryPatchFromValue(options, submittedValue, clearOtherQueryParams));
    onChange?.(submittedValue);
  };

  // The inner component only ever changes one half at a time, so comparing against the value we
  // are holding is enough to tell a dropdown change apart from a keystroke.
  const handleOnValueChange = (nextValue: InputWithMultiSelectValue) => {
    const isSelectionChange = nextValue.selection?.id !== value.selection?.id;
    const isInputChange = nextValue.input !== value.input;
    setValue(nextValue);

    if ((isSelectionChange && updateQueryOnSelectionChange) || (isInputChange && updateQueryOnInputChange)) {
      handleOnSubmit(nextValue);
    }
  };

  return <InputWithMultiSelect { ...rest } options={ options } value={ value } onValueChange={ handleOnValueChange } onChange={ handleOnSubmit } />;
}
