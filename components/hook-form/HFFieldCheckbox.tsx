/* eslint-disable no-unused-vars */
'use client';

import { Path, Control, Controller, FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError } from '@/components/ui/field';

import { Label } from '../ui/label';
import Typography from '../typography/Typography';

interface FormCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  helperText?: string;
  disabled?: boolean;
  fieldClassName?: string;
  checkboxClassName?: string;
  labelClassName?: string;
  onCheckChange?: (checked: boolean) => void;
}

export function HFCheckbox<T extends FieldValues>({
  name,
  label,
  control,
  helperText,
  disabled = false,
  fieldClassName,
  checkboxClassName,
  labelClassName,
  onCheckChange,
}: FormCheckboxProps<T>) {
  return (
    <Controller
      name={ name }
      control={ control }
      render={ ({ field, fieldState }) => {
        const handleOnCheckChange = (checked: boolean) => {
          field.onChange(checked);
          onCheckChange?.(checked);
        };

        return (
          <Field data-invalid={ fieldState.invalid } className={ cn(fieldClassName) }>
            <Label
              className={ cn(
                `
                  has-[[aria-checked=true]]:border-primary-600 has-[[aria-checked=true]]:bg-accent/10
                  dark:has-[[aria-checked=true]]:border-primary-900 dark:has-[[aria-checked=true]]:bg-primary-950
                  flex cursor-pointer items-start gap-3 rounded-lg border p-2
                  hover:bg-accent/10
                `,
                labelClassName,
              ) }
            >
              <Checkbox
                id={ name }
                checked={ field.value }
                onCheckedChange={ handleOnCheckChange }
                disabled={ disabled }
                aria-invalid={ fieldState.invalid }
                className={ checkboxClassName }
              />

              <div className="grid gap-1.5 font-normal">
                <Typography className={ `
                  leading-none font-normal text-gray-600
                  dark:text-gray-300
                ` } variant="body1">
                  { label }
                </Typography>
                { helperText ?
                  <Typography className="text-muted-foreground" variant="body0">
                    { helperText }
                  </Typography>
                : null }
              </div>
            </Label>
            { fieldState.invalid ?
              <FieldError errors={ [fieldState.error] } />
            : null }
          </Field>
        );
      } }
    />
  );
}
