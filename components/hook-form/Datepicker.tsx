'use client';

import { FormItem, FormField, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';

import type { Control } from 'react-hook-form';

import { DatePicker } from './ui/Datepicker';

interface FormDatePickerProps {
  name: string;
  label: string;
  control: Control<any>;
  helperText?: string;
  disabled?: boolean;
}

export function FormDatePicker({ name, label, control, helperText, disabled = false }: FormDatePickerProps) {
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
