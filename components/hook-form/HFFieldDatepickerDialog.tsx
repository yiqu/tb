/* eslint-disable no-unused-vars */
import { CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, addYears, subYears } from 'date-fns';
import { Path, Control, Controller, FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Field, FieldError, FieldLabel, FieldDescription } from '@/components/ui/field';

import { Input } from '../ui/input';
import { CalendarV3 } from '../ui/calendarv3';

interface HFDatepickerDialogProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  disabled?: boolean;
  buttonClassName?: string;
  onValueChange?: (date: any) => void;
  description?: string;
  fieldClassName?: string;
  /** If true, the component will work with epoch timestamps instead of Date objects */
  useEpochTimestamp?: boolean;
  isEpochTimeStampInString?: boolean;
  buttonDisplayFormat?: string;
  showTime?: boolean;
}

// use date-fns to get the end of the next five years
const endMonthIsNExtFiveYears = addYears(new Date(), 5);
const startMonthIsFiveYearsAgo = subYears(new Date(), 5);

export default function HFDatepickerDialog<T extends FieldValues>({
  name,
  label,
  control,
  disabled,
  buttonClassName,
  onValueChange,
  description,
  fieldClassName,
  useEpochTimestamp = false,
  isEpochTimeStampInString = false,
  buttonDisplayFormat = 'PPP',
  showTime = false,
}: HFDatepickerDialogProps<T> & React.ComponentProps<typeof DayPicker>) {
  return (
    <Controller
      name={ name }
      control={ control }
      render={ ({ field, fieldState }) => {
        const handleOnValueChange = (date: Date | undefined) => {
          if (useEpochTimestamp) {
            // Convert Date to epoch timestamp (milliseconds)
            const epochValue = date ? date.getTime() : undefined;
            field.onChange(
              isEpochTimeStampInString ?
                epochValue === undefined ?
                  ''
                : epochValue.toString()
              : epochValue,
            );
            onValueChange?.(epochValue);
          } else {
            field.onChange(date);
            onValueChange?.(date);
          }
        };

        // Convert field value to Date object for DayPicker
        let dateValue = new Date();
        if (useEpochTimestamp && field.value !== undefined && field.value !== null) {
          dateValue = new Date(Number.parseInt(field.value));
        } else if (field.value !== undefined && field.value !== null) {
          dateValue = new Date(field.value);
        }

        let timeValue: string = '00:00:00'; // time format is HH:MM:SS
        if (showTime && dateValue !== undefined && dateValue !== null) {
          timeValue = format(dateValue, 'HH:mm:ss');
        }

        const handleOnTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const time = e.target.value; //HH:mm:ss
          const date = new Date(dateValue);
          if (time) {
            date.setHours(Number(time.split(':')[0]), Number(time.split(':')[1]), Number(time.split(':')[2]));
            if (useEpochTimestamp) {
              field.onChange(isEpochTimeStampInString ? date.getTime().toString() : date.getTime());
              onValueChange?.(date.getTime());
            } else {
              field.onChange(date);
              onValueChange?.(date);
            }
          }
        };

        return (
          <Field data-invalid={ fieldState.invalid } className={ cn('flex flex-col', fieldClassName) }>
            { label ?
              <FieldLabel htmlFor={ name } className={ `
                font-normal text-gray-600
                dark:text-gray-300
              ` }>
                { label }
              </FieldLabel>
            : null }
            <div className="flex flex-row gap-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id={ name }
                    variant="outline"
                    aria-invalid={ fieldState.invalid }
                    className={ cn('truncate pl-3 text-left font-normal', !field.value && 'text-muted-foreground', buttonClassName) }
                  >
                    { dateValue ? format(dateValue, buttonDisplayFormat) : <span>Pick a date</span> }
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={ 2 }>
                  <CalendarV3
                    mode="single"
                    selected={ dateValue }
                    onSelect={ handleOnValueChange }
                    disabled={ disabled }
                    captionLayout="dropdown"
                    endMonth={ endMonthIsNExtFiveYears }
                    startMonth={ startMonthIsFiveYearsAgo }
                  />
                </PopoverContent>
              </Popover>

              { showTime ?
                <Input
                  type="time"
                  id={ `${name}-time-picker` }
                  step="1"
                  value={ timeValue }
                  className={ `
                    appearance-none bg-background
                    [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none
                  ` }
                  onChange={ handleOnTimeChange }
                />
              : null }
            </div>
            { description ?
              <FieldDescription>{ description }</FieldDescription>
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
