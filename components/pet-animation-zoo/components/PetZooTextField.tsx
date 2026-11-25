'use client';

import { useId } from 'react';
import { Path, Control, Controller, FieldValues } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

interface PetZooTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  maxLength?: number;
}

/** A labelled text input bound to React Hook Form, with the Zod error under it. Built on the shadcn `field` and `input`. */
export default function PetZooTextField<T extends FieldValues>({ control, name, label, placeholder, maxLength }: PetZooTextFieldProps<T>) {
  const inputId: string = useId();

  return (
    <Controller
      name={ name }
      control={ control }
      render={ ({ field, fieldState }) => {
        return (
          <Field data-invalid={ fieldState.invalid }>
            <FieldLabel htmlFor={ inputId }>{ label }</FieldLabel>
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
