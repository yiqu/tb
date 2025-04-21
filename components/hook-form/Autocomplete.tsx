/* eslint-disable readable-tailwind/multiline */
'use client';

import * as React from 'react';
import { useRef, useEffect, useCallback } from 'react';
import { X, Check, ChevronsUpDown } from 'lucide-react';
import { type Control, useController } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverPortal, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandItem, CommandList, CommandEmpty, CommandGroup, CommandInput } from '@/components/ui/command';

import { FormItem, FormField, FormLabel, FormControl, FormMessage, FormDescription } from '../ui/form';

export type HFAutocompleteSelectionOption = {
  label: string;
  value: string;
};

interface AutocompleteInputProps {
  options: HFAutocompleteSelectionOption[];
  placeholder?: string;
  label?: React.ReactNode;
  emptyMessage?: string;
  description?: React.ReactNode;
  defaultValues?: string[] | string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (values: string[] | string) => void;
  name: string;
  control?: Control<any>;
  rules?: Record<string, any>;
  multi?: boolean;
  isLoading?: boolean;
}

export function AutocompleteInput({
  options,
  placeholder = 'Select an option...',
  label,
  description,
  emptyMessage = 'No options found.',
  onChange,
  defaultValues = [],
  name,
  control,
  rules,
  isLoading = false,
  multi = true,
}: AutocompleteInputProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef<boolean>(false);

  // convert defaultValues to array for management
  const initialValue: string[] =
    Array.isArray(defaultValues) ? defaultValues
    : defaultValues ? [defaultValues]
    : [];

  // For uncontrolled mode
  const [selectedValues, setSelectedValues] = React.useState<string[]>(initialValue);

  // Use react-hook-form controller if control is provided
  const isControlled = !!control;

  const { field } = useController({
    name: name, // Provide a default name
    control,
    rules,
    defaultValue: defaultValues,
    disabled: !isControlled, // Disable the controller if not controlled
  });

  // Get the current value (either from form control or local state)
  const currentValues: any[] = React.useMemo(() => {
    return (
      isControlled ?
        Array.isArray(field.value) ? field.value
        : field.value ? [field.value]
        : []
      : selectedValues
    );
  }, [isControlled, field.value, selectedValues]);

  // auto scroll to first selected
  useEffect(() => {
    if (open && !wasOpenRef.current && currentValues.length > 0 && !isLoading) {
      const timer = setTimeout(() => {
        if (listRef.current) {
          const selectedValue = currentValues[0];
          const selectedItem = listRef.current.querySelector(`[data-value="${selectedValue}"]`);

          if (selectedItem) {
            selectedItem.scrollIntoView({ block: 'center' });
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }
    wasOpenRef.current = open;
  }, [open, currentValues, isLoading]);

  const handleSelect = React.useCallback(
    (value: string) => {
      let newValues: string[] = [];

      if (multi) {
        newValues =
          currentValues.includes(value) ?
            currentValues.filter((item) => {
              return item !== value;
            })
          : [...currentValues, value];
      } else {
        // single select mode, replace current
        newValues = [value];
        setOpen(false);
      }

      if (isControlled) {
        field.onChange(
          multi ? newValues
          : newValues.length > 0 ? newValues[0]
          : '',
        );
      } else {
        setSelectedValues(newValues);
      }

      onChange?.(
        multi ? newValues
        : newValues.length > 0 ? newValues[0]
        : '',
      );
    },
    [currentValues, field, isControlled, onChange, multi],
  );

  const handleRemove = React.useCallback(
    (value: string) => {
      const newValues = currentValues.filter((item) => item !== value);

      if (isControlled) {
        field.onChange(
          multi ? newValues
          : newValues.length > 0 ? newValues[0]
          : '',
        );
      } else {
        setSelectedValues(newValues);
      }

      onChange?.(
        multi ? newValues
        : newValues.length > 0 ? newValues[0]
        : '',
      );
    },
    [currentValues, field, isControlled, onChange, multi],
  );

  const handleClearAll = useCallback(() => {
    if (isControlled) {
      field.onChange(multi ? [] : '');
    } else {
      setSelectedValues([]);
    }

    onChange?.(multi ? [] : '');
  }, [field, isControlled, multi, onChange]);

  const getSingleSelectedLabel = () => {
    if (currentValues.length === 0) {
      return null;
    }
    const option = options.find((opt) => {
      return opt.value === currentValues[0];
    });
    return option?.label;
  };

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
            <FormControl>
              <div className="flex w-full flex-col gap-1.5">
                <Popover open={ open } onOpenChange={ setOpen }>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={ open }
                      className={ `h-auto w-full justify-between px-3` }
                    >
                      <div className="flex flex-wrap items-center gap-1.5">
                        { currentValues.length === 0 ?
                          <span className="text-muted-foreground">{ isLoading ? 'Loading...' : placeholder }</span>
                        : multi ?
                          currentValues.map((value) => {
                            const option = options.find((opt) => {
                              return opt.value === value;
                            });
                            return (
                              <Badge key={ value } variant="secondary" className={ `flex items-center gap-1` }>
                                { option?.label }
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={ (e) => {
                                    e.stopPropagation();
                                    handleRemove(value);
                                  } }
                                />
                              </Badge>
                            );
                          })
                        : <span>{ getSingleSelectedLabel() }</span> }
                      </div>

                      <div className={ `flex flex-row items-center justify-end gap-x-1` }>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                        { currentValues.length > 0 ?
                          <div
                            className={ `flex size-5 cursor-pointer items-center justify-center rounded-full hover:bg-gray-200` }
                            onClick={ (e) => {
                              e.stopPropagation();
                              handleClearAll();
                            } }
                            aria-label="Clear selection"
                          >
                            <X className="h-4 w-4" />
                          </div>
                        : null }
                      </div>
                    </Button>
                  </PopoverTrigger>

                  <PopoverPortal>
                    <PopoverContent
                      className={ `pointer-events-auto w-[var(--radix-popover-trigger-width)] p-0` }
                      align="start"
                    >
                      <Command>
                        <CommandInput placeholder="Search..." value={ inputValue } onValueChange={ setInputValue } />
                        <CommandList ref={ listRef }>
                          { isLoading ?
                            <ListLoading />
                          : <>
                            <CommandEmpty>{ emptyMessage }</CommandEmpty>
                            <CommandGroup>
                              { options.map((opt) => {
                                  return (
                                    <CommandItem
                                      key={ opt.value }
                                      value={ opt.value }
                                      onSelect={ () => {
                                        handleSelect(opt.value);
                                        setInputValue('');
                                      } }
                                      data-value={ opt.value }
                                      className={ cn(
                                        currentValues.includes(opt.value) && `bg-accent text-accent-foreground`,
                                      ) }
                                    >
                                      <Check
                                        className={ cn(
                                          'mr-2 h-4 w-4',
                                          currentValues.includes(opt.value) ? `opacity-100` : `opacity-0`,
                                        ) }
                                      />
                                    </CommandItem>
                                  );
                                }) }
                            </CommandGroup>
                          </>
                          }
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </PopoverPortal>
                </Popover>
              </div>
            </FormControl>
            <FormDescription>{ description ? description : null }</FormDescription>
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
