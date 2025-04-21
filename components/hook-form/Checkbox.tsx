/* eslint-disable readable-tailwind/multiline */
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { FormItem, FormField, FormLabel, FormControl, FormDescription } from '@/components/ui/form';

import type { Control } from 'react-hook-form';

interface FormCheckboxProps {
  name: string;
  label: string;
  control: Control<any>;
  helperText?: string;
  disabled?: boolean;
}

export function FormCheckbox({ name, label, control, helperText, disabled = false }: FormCheckboxProps) {
  return (
    <FormField
      control={ control }
      name={ name }
      render={ ({ field }) => (
        <FormItem className={ `flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4` }>
          <FormControl>
            <Checkbox checked={ field.value } onCheckedChange={ field.onChange } disabled={ disabled } />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className={ `cursor-pointer text-sm leading-none font-medium` }>{ label }</FormLabel>
            { helperText ?
              <FormDescription className={ `text-sm text-muted-foreground` }>{ helperText }</FormDescription>
            : null }
          </div>
        </FormItem>
      ) }
    />
  );
}
