/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
import { X } from 'lucide-react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Path, Control, Controller, FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { FONT_CSS_CLASSNAME } from '@/lib/vibes-css-map';
import { Field, FieldError, FieldLabel, FieldDescription } from '@/components/ui/field';

import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from '../ui/select';

export type HFSelectOption = {
  label: string;
  value: string;
};

interface HFSelectProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  control: Control<T>;
  options: HFSelectOption[];
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  isLoading?: boolean;
  startAdornment?: React.ReactNode;
  className?: string;
  fieldClassName?: string;
  selectProps?: React.ComponentProps<typeof SelectPrimitive.Root>;
  onChanged?: (_value: string) => void;
}

export default function HFSelect<T extends FieldValues>({
  name,
  control,
  options,
  disabled,
  helperText,
  isLoading,
  label,
  placeholder,
  startAdornment,
  className,
  fieldClassName,
  selectProps,
  onChanged,
}: HFSelectProps<T>) {
  const hasOptions = options.length > 0;
  return (
    <Controller
      name={ name }
      control={ control }
      render={ ({ field, fieldState }) => {
        const handleOnValueChange = (value: string) => {
          field.onChange(value);
          onChanged?.(value);
        };

        const clearValue = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          field.onChange('');
          onChanged?.('');
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

            <div className={ cn('relative', className) }>
              { startAdornment ?
                <div className="pointer-events-none absolute top-0 left-0 flex h-full items-center pl-3">
                  { startAdornment }
                </div>
              : null }
              <Select
                name={ field.name }
                onValueChange={ handleOnValueChange }
                defaultValue={ field.value }
                value={ field.value }
                disabled={ disabled }
                { ...selectProps }
              >
                <SelectTrigger
                  id={ name }
                  aria-invalid={ fieldState.invalid }
                  className={ cn('w-full cursor-pointer', {
                    'pr-10': field.value,
                    'pl-10': startAdornment,
                  }) }
                >
                  <SelectValue placeholder={ placeholder || 'Select an option' } />
                </SelectTrigger>
                <SelectContent>
                  { isLoading ?
                    <ListLoading />
                  : hasOptions ?
                    options.map((opt) => {
                      return (
                        <SelectItem key={ opt.value } value={ opt.value } className={ `${FONT_CSS_CLASSNAME[opt.value]}` }>
                          { opt.label }
                        </SelectItem>
                      );
                    })
                  : <SelectItem value="No options" className="text-muted-foreground" disabled>
                    No options
                  </SelectItem>
                  }
                </SelectContent>
              </Select>
              { field.value ?
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-0 hover:bg-transparent"
                  onClick={ clearValue }
                  aria-label={ `Clear ${name}` }
                >
                  <X className="h-4 w-4" />
                </Button>
              : null }
            </div>
            { helperText ?
              <FieldDescription>{ helperText }</FieldDescription>
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

function ListLoading() {
  return (
    <div className="flex w-full flex-col gap-y-2 py-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}
