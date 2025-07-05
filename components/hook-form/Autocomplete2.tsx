/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
'use client';

import * as React from 'react';
import { X, Check, ChevronsUpDown } from 'lucide-react';
import { type Control, useController } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandItem, CommandList, CommandEmpty, CommandGroup, CommandInput } from '@/components/ui/command';

export type Autocomplete2Option = { label: string; value: string };

interface BaseAutocompleteProps {
  options: Autocomplete2Option[];
  placeholder?: string;
  emptyMessage?: string;
  multi?: boolean;
  isLoading?: boolean;
  searchBy?: 'label' | 'value';
  className?: string;
  labelClassName?: string;
  badgeTextMaxLength?: number;
}

interface ControlledAutocompleteProps extends BaseAutocompleteProps {
  name: string;
  control: Control<any>;
  rules?: Record<string, any>;
  onChange?: never;
  defaultValues?: never;
}

interface UncontrolledAutocompleteProps extends BaseAutocompleteProps {
  onChange: (values: string[] | string) => void;
  defaultValues?: string[] | string;
  name?: never;
  control?: never;
  rules?: never;
}

type AutocompleteInputProps = ControlledAutocompleteProps | UncontrolledAutocompleteProps;

function AutocompleteInputBase({
  options,
  placeholder = 'Select items...',
  emptyMessage = 'No results found.',
  multi = true,
  isLoading = false,
  searchBy = 'label',
  className,
  labelClassName,
  currentValues,
  onSelect,
  onRemove,
  onClearAll,
  badgeTextMaxLength,
}: BaseAutocompleteProps & {
  currentValues: string[];
  onSelect: (value: string) => void;
  onRemove: (value: string) => void;
  onClearAll: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const listRef = React.useRef<HTMLDivElement>(null);
  const wasOpenRef = React.useRef(false);

  // Effect to scroll to selected item when dropdown opens
  React.useEffect(() => {
    if (open && !wasOpenRef.current && currentValues.length > 0 && !isLoading) {
      const timer = setTimeout(() => {
        if (listRef.current) {
          const selectedValue = currentValues[0];
          const selectedItem = listRef.current.querySelector(`[data-value="${selectedValue}"]`);
          if (selectedItem) {
            selectedItem.scrollIntoView({ block: 'nearest' });
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    wasOpenRef.current = open;
  }, [open, currentValues, isLoading]);

  const handleSelect = (value: string) => {
    onSelect(value);
    if (!multi) {
      setOpen(false);
    }
  };

  const getSingleSelectedLabel = () => {
    if (currentValues.length === 0) return null;
    const option = options.find((opt) => opt.value === currentValues[0]);
    return option?.label;
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      <Popover open={ open } onOpenChange={ setOpen }>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={ open } className={ cn('w-full justify-between bg-transparent', className) }>
            <div className="flex flex-wrap items-center gap-1.5">
              { currentValues.length === 0 ?
                <span className={ cn('text-muted-foreground/50', labelClassName) }>{ placeholder }</span>
              : multi ?
                currentValues.map((value) => {
                  const option = options.find((opt) => opt.value === value);
                  let labelDisplay: string | undefined = option?.label;
                  if (badgeTextMaxLength !== undefined) {
                    if ((option?.label ?? '')?.length > badgeTextMaxLength) {
                      labelDisplay = option?.label?.slice(0, badgeTextMaxLength) + '..';
                    } else {
                      labelDisplay = option?.label;
                    }
                  }
                  return (
                    <Badge key={ value } variant="secondary" className="flex items-center gap-1">
                      { labelDisplay }
                      <div
                        className={ `
                          flex h-3 w-3 cursor-pointer items-center justify-center rounded-sm
                          hover:bg-muted-foreground/20
                        ` }
                        onClick={ (e) => {
                          e.stopPropagation();
                          onRemove(value);
                        } }
                        role="button"
                        tabIndex={ 0 }
                        aria-label={ `Remove ${option?.label}` }
                        onKeyDown={ (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            onRemove(value);
                          }
                        } }
                      >
                        <X className="size-3" />
                      </div>
                    </Badge>
                  );
                })
              : <span>{ getSingleSelectedLabel() }</span> }
            </div>
            <div className="flex items-end">
              { currentValues.length > 0 ?
                <div
                  className={ `
                    flex size-4 cursor-pointer items-center justify-center rounded-sm p-0
                    hover:text-accent-foreground
                  ` }
                  onClick={ (e) => {
                    e.stopPropagation();
                    onClearAll();
                  } }
                  role="button"
                  tabIndex={ 0 }
                  aria-label="Clear selection"
                  onKeyDown={ (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      onClearAll();
                    }
                  } }
                >
                  <X className="size-4" />
                </div>
              : <ChevronsUpDown className="size-4 shrink-0 opacity-50" /> }
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search..." value={ inputValue } onValueChange={ setInputValue } />
            <CommandList ref={ listRef }>
              { isLoading ?
                <div className="space-y-1 p-2">
                  <Skeleton className="h-8 w-full rounded" />
                  <Skeleton className="h-8 w-full rounded" />
                  <Skeleton className="h-8 w-full rounded" />
                  <Skeleton className="h-8 w-full rounded" />
                  <Skeleton className="h-8 w-full rounded" />
                </div>
              : <>
                <CommandEmpty>{ emptyMessage }</CommandEmpty>
                <CommandGroup className="">
                  { options.map((option) => {
                      return (
                        <CommandItem
                          key={ option.value }
                          value={ searchBy === 'label' ? option.label : option.value }
                          onSelect={ () => {
                            handleSelect(option.value);
                            setInputValue('');
                          } }
                          data-value={ option.value }
                          className={ cn(
                            `
                              mb-1 flex flex-row items-center justify-between
                              last:mb-0
                            `,
                            currentValues.includes(option.value) && 'bg-accent/40 text-accent-foreground',
                          ) }
                        >
                          <span>{ option.label }</span>
                          <Check className={ cn('ml-2 size-4', currentValues.includes(option.value) ? 'opacity-100' : 'opacity-0') } />
                        </CommandItem>
                      );
                    }) }
                </CommandGroup>
              </>
              }
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Controlled version that uses React Hook Form
function ControlledAutocompleteInput({
  name,
  control,
  rules,
  multi = true,
  searchBy = 'label',
  className,
  ...props
}: ControlledAutocompleteProps) {
  const { field } = useController({
    name,
    control,
    rules,
    defaultValue: multi ? [] : '',
  });

  const currentValues = React.useMemo(() => {
    return (
      Array.isArray(field.value) ? field.value
      : field.value ? [field.value]
      : []
    );
  }, [field.value]);

  const handleSelect = React.useCallback(
    (value: string) => {
      let newValues: string[] = [];
      if (multi) {
        newValues = currentValues.includes(value) ? currentValues.filter((item) => item !== value) : [...currentValues, value];
      } else {
        newValues = [value];
      }
      field.onChange(
        multi ? newValues
        : newValues.length > 0 ? newValues[0]
        : '',
      );
    },
    [currentValues, field, multi],
  );

  const handleRemove = React.useCallback(
    (value: string) => {
      const newValues = currentValues.filter((item) => item !== value);
      field.onChange(
        multi ? newValues
        : newValues.length > 0 ? newValues[0]
        : '',
      );
    },
    [currentValues, field, multi],
  );

  const handleClearAll = React.useCallback(() => {
    field.onChange(multi ? [] : '');
  }, [field, multi]);

  return (
    <AutocompleteInputBase
      { ...props }
      multi={ multi }
      searchBy={ searchBy }
      className={ className }
      currentValues={ currentValues }
      onSelect={ handleSelect }
      onRemove={ handleRemove }
      onClearAll={ handleClearAll }
    />
  );
}

// Uncontrolled version that uses local state
function UncontrolledAutocompleteInput({
  onChange,
  defaultValues = [],
  multi = true,
  searchBy = 'label',
  className,
  ...props
}: UncontrolledAutocompleteProps) {
  const initialValues =
    Array.isArray(defaultValues) ? defaultValues
    : defaultValues ? [defaultValues]
    : [];

  const [selectedValues, setSelectedValues] = React.useState<string[]>(initialValues);

  // Sync local state with defaultValues prop when it changes
  React.useEffect(() => {
    const newValues =
      Array.isArray(defaultValues) ? defaultValues
      : defaultValues ? [defaultValues]
      : [];

    setSelectedValues(newValues);
  }, [defaultValues]);

  const handleSelect = React.useCallback(
    (value: string) => {
      let newValues: string[] = [];
      if (multi) {
        newValues = selectedValues.includes(value) ? selectedValues.filter((item) => item !== value) : [...selectedValues, value];
      } else {
        newValues = [value];
      }
      setSelectedValues(newValues);
      onChange(
        multi ? newValues
        : newValues.length > 0 ? newValues[0]
        : '',
      );
    },
    [selectedValues, onChange, multi],
  );

  const handleRemove = React.useCallback(
    (value: string) => {
      const newValues = selectedValues.filter((item) => item !== value);
      setSelectedValues(newValues);
      onChange(
        multi ? newValues
        : newValues.length > 0 ? newValues[0]
        : '',
      );
    },
    [selectedValues, onChange, multi],
  );

  const handleClearAll = React.useCallback(() => {
    setSelectedValues([]);
    onChange(multi ? [] : '');
  }, [onChange, multi]);

  return (
    <AutocompleteInputBase
      { ...props }
      multi={ multi }
      searchBy={ searchBy }
      className={ className }
      currentValues={ selectedValues }
      onSelect={ handleSelect }
      onRemove={ handleRemove }
      onClearAll={ handleClearAll }
    />
  );
}

// Main component that determines which version to render
export function AutocompleteInput(props: AutocompleteInputProps) {
  // Type guard to check if it's controlled
  if ('control' in props && props.control && props.name) {
    return <ControlledAutocompleteInput { ...props } />;
  }

  // Must be uncontrolled
  return <UncontrolledAutocompleteInput { ...(props as UncontrolledAutocompleteProps) } />;
}
