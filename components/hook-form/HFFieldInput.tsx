/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { Path, Control, Controller, FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel, FieldDescription } from '@/components/ui/field';

import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface HFInputFieldProps<T extends FieldValues> extends Omit<React.ComponentProps<'input'>, 'name'> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  startAdornment?: ReactNode;
  isTextArea?: boolean;
  minLines?: number;
  maxLines?: number;
  disabled?: boolean;
  ref?: any;
  fieldClassName?: string;
}

export function HFInputField<T extends FieldValues>({
  control,
  description,
  startAdornment,
  isTextArea = false,
  minLines = 3,
  maxLines = 10,
  ref,
  name,
  label,
  placeholder,
  disabled,
  fieldClassName,
  ...inputProps
}: HFInputFieldProps<T>) {
  const estimatedLineHeightPx = 24;
  const minHeight = minLines * estimatedLineHeightPx;
  const maxHeight = maxLines ? maxLines * estimatedLineHeightPx : undefined;

  return (
    <Controller
      name={ name }
      control={ control }
      render={ ({ field, fieldState }) => (
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

            { isTextArea ?
              <Textarea
                { ...field }
                id={ name }
                placeholder={ placeholder }
                disabled={ disabled }
                rows={ minLines }
                aria-invalid={ fieldState.invalid }
                className={ cn(
                  'w-full resize-y overflow-y-auto pr-10',
                  {
                    'pl-10': !!startAdornment,
                  },
                  inputProps.className,
                ) }
                style={ {
                  minHeight: `${minHeight}px`,
                  maxHeight: maxHeight ? `${maxHeight}px` : undefined,
                } }
                ref={ ref }
              />
            : <Input
                { ...inputProps }
                { ...field }
                id={ name }
                placeholder={ placeholder }
                disabled={ disabled }
                type={ inputProps.type ?? 'text' }
                aria-invalid={ fieldState.invalid }
                className={ cn(
                  'pr-10',
                  {
                    'pl-10': !!startAdornment,
                  },
                  inputProps.className,
                ) }
                ref={ ref }
              />
            }

            { field.value ?
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={ cn('absolute top-0 right-0 px-3 py-0 hover:bg-transparent', {
                  'h-full': !isTextArea,
                }) }
                onClick={ (e) => {
                  e.stopPropagation();
                  field.onChange('');
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
      ) }
    />
  );
}
