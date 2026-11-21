'use client';

import { useId } from 'react';
import { Path, Control, Controller, FieldValues } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

interface AiModelUploadTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
}

/** A labelled text input bound to React Hook Form, with the Zod error under it. Built on the shadcn `field` and `input`. */
export default function AiModelUploadTextField<T extends FieldValues>({ control, name, label, placeholder, disabled }: AiModelUploadTextFieldProps<T>) {
  // unique per instance, so two upload dialogs (or another form with a `name` field) never share an id
  const inputId: string = useId();

  return (
    <Controller
      name={ name }
      control={ control }
      render={ ({ field, fieldState }) => (
        <Field data-invalid={ fieldState.invalid }>
          <FieldLabel htmlFor={ inputId }>{ label }</FieldLabel>
          <Input
            { ...field }
            id={ inputId }
            type="text"
            autoComplete="off"
            placeholder={ placeholder }
            disabled={ disabled }
            aria-invalid={ fieldState.invalid }
          />
          { fieldState.invalid ?
            <FieldError errors={ [fieldState.error] } />
          : null }
        </Field>
      ) }
    />
  );
}
