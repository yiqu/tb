'use client';

import { useId, ReactNode } from 'react';
import { Path, Control, Controller, FieldValues } from 'react-hook-form';

import { Field, FieldError } from '@/components/ui/field';
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from '@/components/ui/select';

import PixelPalsFieldLabel from './PixelPalsFieldLabel';
import PixelPalsSelectOptionLabel from './PixelPalsSelectOptionLabel';

export interface PixelPalsSelectOption {
  value: string;
  label: string;
  /** Shown before the label, e.g. the pet's sprite. */
  icon?: ReactNode;
  /** Shown after the label, e.g. a lock on a locked pet. */
  trailing?: ReactNode;
  /** Shown but cannot be picked. */
  disabled?: boolean;
}

interface PixelPalsSelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  options: readonly PixelPalsSelectOption[];
  disabled?: boolean;
}

/** A labelled dropdown bound to React Hook Form, with the Zod error under it. Built on the shadcn `field` and `select`. */
export default function PixelPalsSelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  disabled,
}: PixelPalsSelectFieldProps<T>) {
  const triggerId: string = useId();

  return (
    <Controller
      name={ name }
      control={ control }
      render={ ({ field, fieldState }) => {
        return (
          <Field data-invalid={ fieldState.invalid }>
            <PixelPalsFieldLabel htmlFor={ triggerId } label={ label } />
            <Select name={ field.name } value={ field.value ?? '' } onValueChange={ field.onChange } disabled={ disabled }>
              <SelectTrigger
                ref={ field.ref }
                id={ triggerId }
                className="w-full"
                aria-invalid={ fieldState.invalid }
                onBlur={ field.onBlur }
              >
                <SelectValue placeholder={ placeholder } />
              </SelectTrigger>
              <SelectContent>
                { options.map((option: PixelPalsSelectOption) => {
                  return (
                    <SelectItem key={ option.value } value={ option.value } disabled={ option.disabled }>
                      <PixelPalsSelectOptionLabel label={ option.label } icon={ option.icon } trailing={ option.trailing } />
                    </SelectItem>
                  );
                }) }
              </SelectContent>
            </Select>
            { fieldState.invalid ?
              <FieldError errors={ [fieldState.error] } />
            : null }
          </Field>
        );
      } }
    />
  );
}
