'use client';

import { useId } from 'react';
import { Path, Control, Controller, FieldValues } from 'react-hook-form';

import RowStack from '@/shared/components/RowStack';
import Typography from '@/components/typography/Typography';
import { Slider } from '@/components/ui/slider';
import { Field, FieldError } from '@/components/ui/field';

import PixelPalsFieldLabel from './PixelPalsFieldLabel';

interface PixelPalsSliderFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  min: number;
  max: number;
  step: number;
  /** The value as shown next to the label, e.g. "Off" or "40%". */
  formatValue: (_value: number) => string;
}

/** A labelled slider bound to React Hook Form, with its value next to the label and the Zod error under it. Built on the shadcn `field` and `slider`. */
export default function PixelPalsSliderField<T extends FieldValues>({
  control,
  name,
  label,
  min,
  max,
  step,
  formatValue,
}: PixelPalsSliderFieldProps<T>) {
  const labelId: string = useId();

  return (
    <Controller
      name={ name }
      control={ control }
      render={ ({ field, fieldState }) => {
        const value: number = typeof field.value === 'number' ? field.value : min;
        return (
          <Field data-invalid={ fieldState.invalid } aria-labelledby={ labelId }>
            <RowStack className="items-center justify-between">
              <PixelPalsFieldLabel id={ labelId } label={ label } />
              <Typography variant="body1" className="text-muted-foreground tabular-nums">
                { formatValue(value) }
              </Typography>
            </RowStack>
            <Slider
              ref={ field.ref }
              name={ field.name }
              value={ [value] }
              min={ min }
              max={ max }
              step={ step }
              onValueChange={ (values: number[]) => {
                field.onChange(values[0] ?? min);
              } }
              onBlur={ field.onBlur }
              aria-invalid={ fieldState.invalid }
            />
            { fieldState.invalid ?
              <FieldError errors={ [fieldState.error] } />
            : null }
          </Field>
        );
      } }
    />
  );
}
