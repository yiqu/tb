/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
import { X } from 'lucide-react';
import { Control } from 'react-hook-form';
import * as SelectPrimitive from '@radix-ui/react-select';

import { cn } from '@/lib/utils';
import { FONT_CSS_CLASSNAME } from '@/lib/vibes-css-map';

import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from '../ui/select';
import { FormItem, FormField, FormLabel, FormControl, FormMessage, FormDescription } from '../ui/form';

export type HFSelectOption = {
  label: string;
  value: string;
};

interface HFSelectProps {
  name: string;
  label?: string;
  control: Control<any>;
  options: HFSelectOption[];
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  isLoading?: boolean;
  startAdornment?: React.ReactNode;
  className?: string;
  formItemClassName?: string;
  selectProps?: React.ComponentProps<typeof SelectPrimitive.Root>;
  onChanged?: (_value: string) => void;
  renderOption?: (_option: HFSelectOption) => React.ReactNode;
}

export default function HFSelect({
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
  formItemClassName,
  selectProps,
  onChanged,
  renderOption,
}: HFSelectProps) {
  const hasOptions = options.length > 0;
  return (
    <FormField
      control={ control }
      name={ name }
      render={ ({ field }) => {
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
          <FormItem className={ formItemClassName }>
            { label ?
              <FormLabel className="font-normal text-gray-600 dark:text-gray-300">{ label }</FormLabel>
            : null }

            <div className={ cn('relative', className) }>
              { startAdornment ?
                <div className={ `pointer-events-none absolute top-0 left-0 flex h-full items-center pl-3` }>{ startAdornment }</div>
              : null }
              <Select
                onValueChange={ handleOnValueChange }
                defaultValue={ field.value }
                value={ field.value }
                disabled={ disabled }
                { ...selectProps }
              >
                <FormControl className="w-full">
                  <SelectTrigger
                    className={ cn('cursor-pointer', {
                      'pr-10': field.value,
                      'pl-10': startAdornment,
                    }) }
                  >
                    <SelectValue placeholder={ placeholder || 'Select an option' } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  { isLoading ?
                    <ListLoading />
                  : hasOptions ?
                    options.map((opt) => {
                      if (renderOption) {
                        return renderOption(opt);
                      }
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
                  className={ `absolute top-0 right-0 h-full px-3 py-0 hover:bg-transparent` }
                  onClick={ clearValue }
                  aria-label={ `Clear ${name}` }
                >
                  <X className="h-4 w-4" />
                </Button>
              : null }
            </div>
            { helperText ?
              <FormDescription>{ helperText }</FormDescription>
            : null }
            <FormMessage />
          </FormItem>
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
