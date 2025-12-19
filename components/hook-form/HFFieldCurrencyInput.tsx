/* eslint-disable no-unused-vars */
/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import omit from 'lodash/omit';
import { X } from 'lucide-react';
import { ReactNode } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { Path, Control, Controller, FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Field, FieldError, FieldLabel, FieldDescription } from '@/components/ui/field';

import type { CurrencyInputProps, CurrencyInputOnChangeValues } from 'react-currency-input-field';

import { Button } from '../ui/button';

interface HFCurrencyInputProps<T extends FieldValues> extends CurrencyInputProps {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  startAdornment?: ReactNode;
  disabled?: boolean;
  ref?: any;
  fieldClassName?: string;
  clearField?: (name: string) => void;
}

export function HFCurrencyInput<T extends FieldValues>({
  control,
  description,
  startAdornment,
  ref,
  name,
  label,
  placeholder,
  disabled,
  clearField,
  fieldClassName,
  ...inputProps
}: HFCurrencyInputProps<T>) {
  return (
    <Controller
      name={ name }
      control={ control }
      render={ ({ field, fieldState }) => {
        const handleOnValueChange = (
          value: string | undefined,
          _name: string | undefined,
          values: CurrencyInputOnChangeValues | undefined,
        ) => {
          field.onChange(values?.value);
        };

        const handleClearField = () => {
          field.onChange('');
          clearField?.(name);
        };

        return (
          <Field data-invalid={ fieldState.invalid } className={ cn(fieldClassName) }>
            { label ?
              <FieldLabel
                htmlFor={ name }
                className="font-normal text-gray-600 dark:text-gray-300"
              >
                { label }
              </FieldLabel>
            : null }
            <div className="relative">
              { startAdornment ?
                <div className="pointer-events-none absolute top-0 left-0 flex h-full items-center pl-3">
                  { startAdornment }
                </div>
              : null }

              <CurrencyInput
                id={ name }
                prefix="$ "
                placeholder={ placeholder ?? 'Amount' }
                allowNegativeValue={ false }
                decimalsLimit={ 2 }
                autoComplete="off"
                allowDecimals
                disabled={ disabled }
                aria-invalid={ fieldState.invalid }
                { ...inputProps }
                { ...omit(field, ['onChange', 'onValueChange']) }
                onValueChange={ (value, _name, values) => handleOnValueChange(value, _name, values) }
                style={ {
                  ...inputProps.style,
                  borderColor: fieldState.error ? '#ef5350' : undefined,
                } }
                ref={ ref }
                className={ cn(
                  `flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30`,
                  `focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50`,
                  `aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40`,
                  inputProps.className,
                ) }
              />
              { field.value ?
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-0 hover:bg-transparent"
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
              <FieldDescription>{ description }</FieldDescription>
            : null }
            { fieldState.invalid ?
              <FieldError errors={ [fieldState.error] } />
            : null }
          </Field>
        );
      } }
    />
  );
}
