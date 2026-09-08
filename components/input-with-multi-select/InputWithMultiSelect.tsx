'use client';

import { useState, KeyboardEvent, ChangeEvent } from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import RowStack from '@/shared/components/RowStack';

import InputWithMultiSelectClearButton from './InputWithMultiSelectClearButton';
import InputWithMultiSelectOptionSelect from './InputWithMultiSelectOptionSelect';
import InputWithMultiSelectSubmitTrigger from './InputWithMultiSelectSubmitTrigger';
import {
  InputWithMultiSelectProps,
  InputWithMultiSelectValue,
  InputWithMultiSelectChangeCause,
  InputWithMultiSelectSelectOption,
  INPUT_WITH_MULTI_SELECT_CHANGE_CAUSES,
} from './input-with-multi-select.models';
import { resolveDefaultOption, getTrimmedInput, createInputWithMultiSelectValue } from './input-with-multi-select.utils';

/**
 * An input made of three parts: an option dropdown on the left, the text field in the middle,
 * and a clickable submit icon inside the field on the right.
 *
 * Uncontrolled by default — it owns `{ input, selection }` and hands the whole thing to `onChange`
 * when the user submits (Enter or the trigger icon). Changing the dropdown alone never fires
 * `onChange`; use `onValueChange` when every keystroke / selection change matters.
 *
 * Pass `value` + `onValueChange` to drive it from the outside instead (what the nuqs and
 * react-hook-form wrappers do).
 */
export default function InputWithMultiSelect({
  options,
  defaultSelectedOptionId,
  defaultInputValue = '',
  value: controlledValue,
  onValueChange,
  onChange,
  submitOnEnter = true,
  clearOnSubmit = false,
  disableSubmitWhenEmpty = false,
  triggerIcon,
  triggerLabel,
  clearIcon,
  clearLabel,
  selectLabel,
  hideTrigger = false,
  hideClearButton = false,
  containerClassName,
  selectClassName,
  selectContentClassName,
  triggerClassName,
  clearClassName,
  className,
  disabled,
  onKeyDown,
  ...inputProps
}: InputWithMultiSelectProps) {
  const [internalValue, setInternalValue] = useState<InputWithMultiSelectValue>(() => {
    return createInputWithMultiSelectValue(defaultInputValue, resolveDefaultOption(options, defaultSelectedOptionId));
  });

  const isControlled = controlledValue !== undefined;

  // When uncontrolled, keep resolving the default option so late arriving `options`
  // (async loaded lists) still end up with a selection without an effect.
  const value: InputWithMultiSelectValue =
    isControlled ? controlledValue : (
      createInputWithMultiSelectValue(internalValue.input, internalValue.selection ?? resolveDefaultOption(options, defaultSelectedOptionId))
    );

  const applyValue = (nextValue: InputWithMultiSelectValue, cause: InputWithMultiSelectChangeCause) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue, cause);
  };

  const handleOnInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    applyValue(createInputWithMultiSelectValue(event.target.value, value.selection), INPUT_WITH_MULTI_SELECT_CHANGE_CAUSES.input);
  };

  // Selection changes are deliberately NOT a submit: only `onValueChange` hears about them.
  const handleOnOptionChange = (option: InputWithMultiSelectSelectOption) => {
    applyValue(createInputWithMultiSelectValue(value.input, option), INPUT_WITH_MULTI_SELECT_CHANGE_CAUSES.selection);
  };

  const isSubmitDisabled = !!disabled || (disableSubmitWhenEmpty && getTrimmedInput(value) === '');

  const handleOnSubmit = () => {
    if (isSubmitDisabled) {
      return;
    }
    onChange?.(value);
    if (clearOnSubmit) {
      applyValue(createInputWithMultiSelectValue('', value.selection), INPUT_WITH_MULTI_SELECT_CHANGE_CAUSES.reset);
    }
  };

  // Clearing is a submit of the emptied value, so whoever listens to `onChange` gets to react —
  // that is what drops the query param in the nuqs flavour. It is a compound event: the `clear`
  // cause tells `onValueChange` listeners that the submit below is already on its way.
  const handleOnClear = () => {
    if (disabled) {
      return;
    }
    const clearedValue = createInputWithMultiSelectValue('', value.selection);
    applyValue(clearedValue, INPUT_WITH_MULTI_SELECT_CHANGE_CAUSES.clear);
    onChange?.(clearedValue);
  };

  const handleOnKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    // `defaultPrevented` lets a caller's own onKeyDown opt out of the built in submit.
    if (submitOnEnter && event.key === 'Enter' && !event.defaultPrevented && !event.nativeEvent.isComposing) {
      // Stop a surrounding <form> from submitting on our behalf.
      event.preventDefault();
      handleOnSubmit();
    }
  };

  // Raw string on purpose, not trimmed: whitespace is still something the clear button has to be
  // able to remove, and submitting it trims to empty, which is how a search gets cleared.
  const hasInput = value.input !== '';
  const showClearButton = hasInput && !hideClearButton;
  const showSubmitTrigger = hasInput && !hideTrigger;

  return (
    <div className={ cn('flex w-full flex-row items-stretch', containerClassName) }>
      <InputWithMultiSelectOptionSelect
        options={ options }
        selectedOptionId={ value.selection?.id ?? null }
        onOptionChange={ handleOnOptionChange }
        disabled={ disabled }
        label={ selectLabel }
        className={ selectClassName }
        contentClassName={ selectContentClassName }
      />
      <div className="relative w-full">
        <Input
          { ...inputProps }
          value={ value.input }
          disabled={ disabled }
          onChange={ handleOnInputChange }
          onKeyDown={ handleOnKeyDown }
          className={ cn(
            'rounded-l-none',
            {
              'pl-9': showSubmitTrigger,
              'pr-9': showClearButton,
            },
            className,
          ) }
        />
        { showSubmitTrigger ?
          <RowStack className="absolute top-1/2 left-1 items-center -translate-y-1/2">
            <InputWithMultiSelectSubmitTrigger
              onSubmit={ handleOnSubmit }
              disabled={ isSubmitDisabled }
              icon={ triggerIcon }
              label={ triggerLabel }
              className={ triggerClassName }
            />
          </RowStack>
        : null }
        { showClearButton ?
          <RowStack className="absolute top-1/2 right-1 items-center -translate-y-1/2">
            <InputWithMultiSelectClearButton
              onClear={ handleOnClear }
              disabled={ disabled }
              icon={ clearIcon }
              label={ clearLabel }
              className={ clearClassName }
            />
          </RowStack>
        : null }
      </div>
    </div>
  );
}
