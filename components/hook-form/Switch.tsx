/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import { Switch } from '@/components/ui/switch';
import { FormItem, FormField, FormLabel, FormControl, FormDescription } from '@/components/ui/form';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';

interface FormSwitchProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  helperText?: string;
  disabled?: boolean;
}

export function FormSwitch<T extends FieldValues>({ name, label, control, helperText, disabled = false }: FormSwitchProps<T>) {
  return (
    <FormField
      control={ control }
      name={ name }
      render={ ({ field }) => (
        <FormItem className={ `flex flex-row items-center justify-between rounded-lg border p-4` }>
          <div className="space-y-0.5">
            <FormLabel className="text-base">{ label }</FormLabel>
            { helperText ?
              <FormDescription>{ helperText }</FormDescription>
            : null }
          </div>
          <FormControl>
            <Switch checked={ field.value } onCheckedChange={ field.onChange } disabled={ disabled } />
          </FormControl>
        </FormItem>
      ) }
    />
  );
}
