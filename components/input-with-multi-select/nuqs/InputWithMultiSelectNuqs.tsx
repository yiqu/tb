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
}

/**
 * `InputWithMultiSelect` wired to the URL: submitting (Enter or the trigger icon) writes the
 * trimmed text to the query parameter of whichever option is selected — `queryParam` on
 * `InputWithMultiSelectSelectOption` decides the key.
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
    setQueryValues(buildQueryPatchFromValue(options, submittedValue, clearOtherQueryParams));
    onChange?.(submittedValue);
  };

  return <InputWithMultiSelect { ...rest } options={ options } value={ value } onValueChange={ setValue } onChange={ handleOnSubmit } />;
}
