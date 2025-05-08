/* eslint-disable readable-tailwind/multiline */
import { X } from 'lucide-react';
import { Control } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
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
}: HFSelectProps) {
  return (
    <FormField
      control={ control }
      name={ name }
      render={ ({ field }) => {
        return (
          <FormItem>
            { label ?
              <FormLabel>{ label }</FormLabel>
            : null }

            <div className="relative">
              { startAdornment ?
                <div className={ `pointer-events-none absolute top-0 left-0 flex h-full items-center pl-3` }>
                  { startAdornment }
                </div>
              : null }
              <Select onValueChange={ field.onChange } defaultValue={ field.value } value={ field.value } disabled={ disabled }>
                <FormControl className="w-full">
                  <SelectTrigger
                    className={ cn({
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
                  : options.map((opt) => {
                      return (
                        <SelectItem key={ opt.value } value={ opt.value }>
                          { opt.label }
                        </SelectItem>
                      );
                    })
                  }
                </SelectContent>
              </Select>
              { field.value ?
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={ `absolute top-0 right-0 h-full px-3 py-0 hover:bg-transparent` }
                  onClick={ (e) => {
                    e.stopPropagation();
                    field.onChange('');
                  } }
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
  return <div>Loading...</div>;
}
