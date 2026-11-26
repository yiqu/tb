'use client';

import { useId } from 'react';
import { Path, Control, Controller, FieldValues } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Field, FieldError } from '@/components/ui/field';

import PixelPalsFieldLabel from './PixelPalsFieldLabel';

interface PixelPalsTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  maxLength?: number;
}

/** A labelled text input bound to React Hook Form, with the Zod error under it. Built on the shadcn `field` and `input`. */
export default function PixelPalsTextField<T extends FieldValues>({ control, name, label, placeholder, maxLength }: PixelPalsTextFieldProps<T>) {
  const inputId: string = useId();

  return (
    <Controller
      name={ name }
      control={ control }
      render={ ({ field, fieldState }) => {
        return (
          <Field data-invalid={ fieldState.invalid }>
            <PixelPalsFieldLabel htmlFor={ inputId } label={ label } />
            <Input
              { ...field }
              id={ inputId }
              type="text"
              autoComplete="off"
              placeholder={ placeholder }
              maxLength={ maxLength }
              aria-invalid={ fieldState.invalid }
            />
            { fieldState.invalid ?
              <FieldError errors={ [fieldState.error] } />
            : null }
          </Field>
        );
      } }
    />
  );
}
