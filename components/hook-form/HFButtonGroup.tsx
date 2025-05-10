/* eslint-disable readable-tailwind/multiline */
import { useState } from 'react';
import { Control } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { FormItem, FormField, FormLabel, FormControl } from '../ui/form';

interface ButtonGroupOption {
  label: string;
  value: string;
}

interface HFButtonGroupProps {
  options: ButtonGroupOption[];
  defaultValue?: string;

  onChange?: (value: string) => void;
  className?: string;
  value?: string;
  control?: Control<any>;
  name?: string;
  label?: string;
  tooltipMap?: Record<string, string>;
}

export default function HFButtonGroup({
  options,
  defaultValue,
  onChange,
  className,
  value: controlledValue,
  control,
  name,
  label,
  tooltipMap,
}: HFButtonGroupProps) {
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);

  // if its controlled
  const isControlled = controlledValue !== undefined;
  const localValue = isControlled ? controlledValue : internalValue;

  const handleOnLocalSelect = (selectedValue: string) => {
    if (!isControlled) {
      setInternalValue(selectedValue);
    }
    onChange?.(selectedValue);
  };

  // if using with react hook form
  if (control && name) {
    return (
      <FormField
        control={ control }
        name={ name }
        render={ ({ field }) => {
          const handleOnChange = (val: string) => {
            field.onChange(val);
            onChange && onChange(val);
          };
          return (
            <FormItem>
              { label ?
                <FormLabel>{ label }</FormLabel>
              : null }
              <FormControl>
                <ButtonGroupContent
                  options={ options }
                  value={ field.value }
                  onChange={ handleOnChange }
                  onBlur={ field.onBlur }
                  className={ className }
                  tooltipMap={ tooltipMap }
                />
              </FormControl>
            </FormItem>
          );
        } }
      />
    );
  }

  //standalone mode

  return (
    <ButtonGroupContent
      options={ options }
      value={ localValue }
      onChange={ handleOnLocalSelect }
      className={ className }
      tooltipMap={ tooltipMap }
    />
  );
}

interface ButtonGroupContentProps {
  options: ButtonGroupOption[];
  value?: string;

  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  tooltipMap?: Record<string, string>;
}

function ButtonGroupContent({ options, value, onChange, onBlur, className, tooltipMap }: ButtonGroupContentProps) {
  return (
    <div className={ cn('inline-flex flex-wrap rounded-md', className) }>
      { options.map((option, index) => {
        const isSelected = value === option.value;

        return (
          <Tooltip key={ option.value }>
            <TooltipTrigger asChild>
              <Button
                size="default"
                type="button"
                variant="outline"
                onClick={ () => onChange(option.value) }
                onBlur={ onBlur }
                className={ cn(
                  `h-8 rounded-none border-r-0 shadow-none hover:bg-muted-foreground hover:text-background hover:dark:bg-muted-foreground`,
                  {
                    '-ml-px': index !== 0,
                    'rounded-l-md': index === 0,
                    'rounded-r-md border-r': index === options.length - 1,
                    'bg-muted-foreground text-background dark:bg-muted-foreground': isSelected,
                  },
                ) }
              >
                { option.label }
              </Button>
            </TooltipTrigger>
            { tooltipMap ?
              <TooltipContent>{ tooltipMap[option.value] }</TooltipContent>
            : null }
          </Tooltip>
        );
      }) }
    </div>
  );
}
