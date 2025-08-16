/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { FieldValues, ControllerRenderProps } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { FormItem, FormField, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';

import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface HFInputFieldProps extends React.ComponentProps<'input'> {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  startAdornment?: ReactNode;
  isTextArea?: boolean;
  minLines?: number;
  maxLines?: number;
  disabled?: boolean;
  ref?: any;
  formItemClassName?: string;
}

export function HFInputField({
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
  formItemClassName,
  ...inputProps
}: HFInputFieldProps) {
  const lineHeight = 3;
  const minHeight = minLines * lineHeight;
  const maxHeight = maxLines * lineHeight;

  return (
    <FormField
      control={ control }
      name={ name }
      render={ ({ field }: { field: ControllerRenderProps<FieldValues, string> }) => (
        <FormItem className={ cn(formItemClassName) }>
          { label ?
            <FormLabel className="text-gray-600 dark:text-gray-300 font-normal">{ label }</FormLabel>
          : null }
          <div className="relative">
            { startAdornment ?
              <div className={ `pointer-events-none absolute top-0 left-0 flex h-full items-center pl-3` }>
                { startAdornment }
              </div>
            : null }

            <FormControl>
              { isTextArea ?
                <Textarea
                  { ...field }
                  placeholder={ placeholder }
                  disabled={ disabled }
                  className={ cn(`w-full resize-y overflow-y-auto pr-10`, inputProps.className) }
                  style={ {
                    minHeight: `${minHeight}px`,
                    maxHeight: maxHeight ? `${maxHeight}px` : undefined,
                  } }
                  ref={ ref }
                />
              : <Input
                  { ...inputProps }
                  { ...field }
                  placeholder={ placeholder }
                  type={ inputProps.type ?? 'text' }
                  className={ cn(
                    `pr-10`,
                    {
                      'pl-10': !!startAdornment,
                    },
                    inputProps.className,
                  ) }
                  ref={ ref }
                />
              }
            </FormControl>
            { field.value ?
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={ cn(`absolute top-0 right-0 px-3 py-0 hover:bg-transparent`, {
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
            <FormDescription>{ description }</FormDescription>
          : null }
          <FormMessage />
        </FormItem>
      ) }
    />
  );
}
