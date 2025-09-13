/* eslint-disable no-unused-vars */
'use client';

import { X } from 'lucide-react';
import { type Control, useController } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormItem, FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

import type React from 'react';

interface FormInputProps {
  name: string;
  label: string;
  control: Control<any>;
  placeholder?: string;
  type?: string;
  clearField?: (name: string) => void;
  description?: React.ReactNode;
  disabled?: boolean;
  formItemClassName?: string;
  clearButtonClassName?: string;
}

export function FormInput({
  name,
  label,
  control,
  placeholder,
  type = 'text',
  clearField,
  description,
  disabled = false,
  formItemClassName,
  clearButtonClassName,
}: FormInputProps) {
  const { field } = useController({
    name,
    control,
  });

  return (
    <FormField
      control={ control }
      name={ name }
      render={ ({ field: formField }) => (
        <FormItem className={ cn('', formItemClassName) }>
          <FormLabel>{ label }</FormLabel>
          <div className="relative">
            <FormControl>
              <Input { ...formField } type={ type } placeholder={ placeholder } disabled={ disabled } className={ clearField ? 'pr-10' : '' } />
            </FormControl>
            { clearField && formField.value ?
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={ cn('absolute top-1 right-1 h-7 px-3', clearButtonClassName) }
                onClick={ () => clearField(name) }
                aria-label={ `Clear ${label}` }
              >
                <X className="size-4" />
              </Button>
            : null }
          </div>
          { description }
          <FormMessage />
        </FormItem>
      ) }
    />
  );
}
