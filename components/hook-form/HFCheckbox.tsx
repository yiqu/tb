/* eslint-disable no-unused-vars */
'use client';

import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { FormItem, FormField, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';

import type { Control } from 'react-hook-form';

import { Label } from '../ui/label';
import Typography from '../typography/Typography';

interface FormCheckboxProps {
  name: string;
  label: string;
  control: Control<any>;
  helperText?: string;
  disabled?: boolean;
  formItemClassName?: string;
  checkboxClassName?: string;
  labelClassName?: string;
  onCheckChange?: (checked: boolean) => void;
}

export function HFCheckbox({
  name,
  label,
  control,
  helperText,
  disabled = false,
  formItemClassName,
  checkboxClassName,
  labelClassName,
  onCheckChange,
}: FormCheckboxProps) {
  return (
    <FormField
      control={ control }
      name={ name }
      render={ ({ field }) => {
        const handleOnCheckChange = (checked: boolean) => {
          field.onChange(checked);
          onCheckChange?.(checked);
        };

        return (
          <FormItem className={ cn(``, formItemClassName) }>
            <Label
              className={ `
                has-[[aria-checked=true]]:border-primary-600
                dark:has-[[aria-checked=true]]:border-primary-900 dark:has-[[aria-checked=true]]:bg-primary-950
                flex cursor-pointer items-start gap-3 rounded-lg border p-2
                hover:bg-accent/10
                has-[[aria-checked=true]]:bg-accent/10
              ` }
            >
              <Checkbox checked={ field.value } onCheckedChange={ handleOnCheckChange } disabled={ disabled } className={ checkboxClassName } />

              <div className="grid gap-1.5 font-normal">
                <Typography className={ `
                  leading-none font-normal text-gray-600
                  dark:text-gray-300
                ` } variant="body1">
                  { label }
                </Typography>
                { helperText ?
                  <Typography className="text-muted-foreground" variant="body0">
                    { helperText }
                  </Typography>
                : null }
              </div>
            </Label>
            <FormMessage />
          </FormItem>
        );
      } }
    />
  );
}
