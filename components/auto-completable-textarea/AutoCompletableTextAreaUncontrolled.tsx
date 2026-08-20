'use client';

import { useState } from 'react';

import AutoCompletableTextArea from './AutoCompletableTextArea';
import { AutoCompleteValue, AutoCompletableTextAreaProps } from './autocompletable-textarea.models';

interface AutoCompletableTextAreaUncontrolledProps<T> extends Omit<AutoCompletableTextAreaProps<T>, 'value' | 'onValueChange'> {
  /** Initial value — the component owns its state from there on. */
  initValue?: AutoCompleteValue<T>;
  /** Optional notification callback fired on every change. */
  onChange?: (value: AutoCompleteValue<T>) => void;
}

/**
 * Dumb / uncontrolled version of AutoCompletableTextArea: no form library needed, just an
 * optional `initValue` and an `onChange` callback. State lives inside the component.
 */
export default function AutoCompletableTextAreaUncontrolled<T>({ initValue, onChange, ...rest }: AutoCompletableTextAreaUncontrolledProps<T>) {
  const [value, setValue] = useState<AutoCompleteValue<T>>(initValue ?? []);

  const handleValueChange = (next: AutoCompleteValue<T>) => {
    setValue(next);
    onChange?.(next);
  };

  return <AutoCompletableTextArea<T> { ...rest } value={ value } onValueChange={ handleValueChange } />;
}
