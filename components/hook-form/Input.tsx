'use client';

import { X } from 'lucide-react';
import { type Control, useController } from 'react-hook-form';

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
        <FormItem>
          <FormLabel>{ label }</FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                { ...formField }
                type={ type }
                placeholder={ placeholder }
                disabled={ disabled }
                className={ clearField ? 'pr-10' : '' }
              />
            </FormControl>
            { clearField && formField.value ? <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-0"
                onClick={ () => clearField(name) }
                aria-label={ `Clear ${label}` }
              >
              <X className="h-4 w-4" />
            </Button> : null }
          </div>
          { description }
          <FormMessage />
        </FormItem>
      ) }
    />
  );
}
