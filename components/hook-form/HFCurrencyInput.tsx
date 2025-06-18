/* eslint-disable no-unused-vars */
/* eslint-disable better-tailwindcss/multiline */
'use client';

import omit from 'lodash/omit';
import { X } from 'lucide-react';
import { ReactNode } from 'react';
import CurrencyInput from 'react-currency-input-field';

import { cn } from '@/lib/utils';
import { FormItem, FormField, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';

import type { CurrencyInputProps, CurrencyInputOnChangeValues } from 'react-currency-input-field';

import { Button } from '../ui/button';

interface HFCurrencyInputProps extends CurrencyInputProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  startAdornment?: ReactNode;
  disabled?: boolean;
  ref?: any;
  formItemClassName?: string;
  clearField?: (name: string) => void;
}

export function HFCurrencyInput({
  control,
  description,
  startAdornment,
  ref,
  name,
  label,
  placeholder,
  disabled,
  clearField,
  formItemClassName,
  ...inputProps
}: HFCurrencyInputProps) {
  return (
    <FormField
      control={ control }
      name={ name }
      render={ ({ field, fieldState: { invalid, isTouched, isDirty, error }, formState }) => {
        const handleOnValueChange = (
          value: string | undefined,
          name: string | undefined,
          values: CurrencyInputOnChangeValues | undefined,
        ) => {
          field.onChange(values?.value);
        };

        const handleClearField = () => {
          field.onChange('');
          clearField?.(name);
        };

        return (
          <FormItem className={ cn(formItemClassName) }>
            { label ?
              <FormLabel>{ label }</FormLabel>
            : null }
            <div className="relative">
              { startAdornment ?
                <div className={ `pointer-events-none absolute top-0 left-0 flex h-full items-center pl-3` }>{ startAdornment }</div>
              : null }

              <FormControl>
                <CurrencyInput
                  id={ name }
                  prefix="$ "
                  placeholder={ placeholder ?? 'Amount' }
                  allowNegativeValue={ false }
                  decimalsLimit={ 2 }
                  autoComplete="off"
                  allowDecimals
                  disabled={ disabled }
                  { ...inputProps }
                  { ...omit(field, ['onChange', 'onValueChange']) }
                  onValueChange={ (value, name, values) => handleOnValueChange(value, name, values) }
                  style={ {
                    ...inputProps.style,
                    borderColor: error ? '#ef5350' : undefined,
                  } }
                  ref={ ref }
                  className={ cn(
                    `flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30`,
                    `focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50`,
                    `aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40`,
                    inputProps.className,
                  ) }
                />
              </FormControl>
              { field.value ?
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={ cn(`absolute top-0 right-0 px-3 py-0 hover:bg-transparent`, {
                    'h-full': true,
                  }) }
                  onClick={ (e) => {
                    e.stopPropagation();
                    handleClearField();
                  } }
                >
                  <X className="h-4 w-4" />
                </Button>
              : null }
            </div>
            { description ?
              <FormDescription>{ description }</FormDescription>
            : null }
            <FormMessage />
          </FormItem>
        );
      } }
    />
  );
}
