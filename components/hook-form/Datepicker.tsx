'use client';

import { FormItem, FormField, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { DatePicker } from './ui/Datepicker';

interface FormDatePickerProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  helperText?: string;
  disabled?: boolean;
}

export function FormDatePicker<T extends FieldValues>({ name, label, control, helperText, disabled = false }: FormDatePickerProps<T>) {
  return (
    <FormField
      control={ control }
      name={ name }
      render={ ({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{ label }</FormLabel>
          <FormControl>
            <DatePicker date={ field.value } setDate={ (date) => field.onChange(date) } disabled={ disabled } />
          </FormControl>
          { helperText ?
            <FormDescription>{ helperText }</FormDescription>
          : null }
          <FormMessage />
        </FormItem>
      ) }
    />
  );
}
