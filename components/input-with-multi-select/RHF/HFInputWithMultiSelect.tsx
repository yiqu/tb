'use client';

import { Control, FieldValues, FieldPathByValue, ControllerRenderProps } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { FormItem, FormField, FormLabel, FormControl, FormDescription } from '@/components/ui/form';

import InputWithMultiSelect from '../InputWithMultiSelect';
import HFInputWithMultiSelectFormMessage from './HFInputWithMultiSelectFormMessage';
import { normalizeInputWithMultiSelectValue } from '../input-with-multi-select.utils';
import { InputWithMultiSelectProps, InputWithMultiSelectValue } from '../input-with-multi-select.models';

export interface HFInputWithMultiSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, InputWithMultiSelectValue>,
> extends Omit<InputWithMultiSelectProps, 'value' | 'onValueChange' | 'onChange' | 'name'> {
  control: Control<TFieldValues>;
  /** Path of a field whose value is an `InputWithMultiSelectValue` — the shape is type checked. */
  name: TName;
  label?: string;
  description?: string;
  formItemClassName?: string;
  /** Optional: fires on every value change (typing and dropdown), after the form field is updated. */
  onChange?: (value: InputWithMultiSelectValue) => void;
  /** Optional: fires only on submit (Enter or the trigger icon). */
  onSubmit?: (value: InputWithMultiSelectValue) => void;
}

/**
 * react-hook-form flavour of `InputWithMultiSelect`. The field value is the whole
 * `InputWithMultiSelectValue` object (`{ input, selection }`), not a plain string, so the
 * selection travels with the text — validate it with `inputWithMultiSelectValueSchema`.
 *
 * `defaultValues` for the field should therefore be an `InputWithMultiSelectValue`; anything
 * missing is normalized against `options` / `defaultSelectedOptionId`.
 */
export default function HFInputWithMultiSelect<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, InputWithMultiSelectValue>,
>({
  control,
  name,
  label,
  description,
  formItemClassName,
  onChange,
  onSubmit,
  options,
  defaultSelectedOptionId,
  ...rest
}: HFInputWithMultiSelectProps<TFieldValues, TName>) {
  return (
    <FormField
      control={ control }
      name={ name }
      render={ ({ field }: { field: ControllerRenderProps<TFieldValues, TName> }) => {
        const value = normalizeInputWithMultiSelectValue(field.value, options, defaultSelectedOptionId);

        const handleOnValueChange = (nextValue: InputWithMultiSelectValue) => {
          field.onChange(nextValue);
          onChange?.(nextValue);
        };

        return (
          <FormItem className={ cn(formItemClassName) }>
            { label ?
              <FormLabel className="font-normal text-gray-600 dark:text-gray-300">{ label }</FormLabel>
            : null }
            <FormControl>
              <InputWithMultiSelect
                { ...rest }
                options={ options }
                defaultSelectedOptionId={ defaultSelectedOptionId }
                name={ field.name }
                ref={ field.ref }
                onBlur={ field.onBlur }
                value={ value }
                onValueChange={ handleOnValueChange }
                onChange={ onSubmit }
              />
            </FormControl>
            { description ?
              <FormDescription>{ description }</FormDescription>
            : null }
            <HFInputWithMultiSelectFormMessage />
          </FormItem>
        );
      } }
    />
  );
}
