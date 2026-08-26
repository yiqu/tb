/* eslint-disable no-unused-vars */
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, addYears, subYears } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CalendarV2 } from '@/components/ui/calendarv2';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/custom/popover';
import { FormItem, FormField, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';

import { Input } from '../ui/input';

interface HFDatepickerDialogProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  disabled?: boolean;
  buttonClassName?: string;
  onValueChange?: (date: any) => void;
  description?: string;
  formItemClassName?: string;
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
  formItemClassName,
  useEpochTimestamp = false,
  isEpochTimeStampInString = false,
  buttonDisplayFormat = 'PPP',
  showTime = false,
}: HFDatepickerDialogProps<T> & React.ComponentProps<typeof DayPicker>) {
  return (
    <FormField
      control={ control }
      name={ name }
      render={ ({ field }) => {
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

        // DayPicker always hands back the picked day at midnight. When a time input is shown, carry
        // over the time it currently displays so picking a date does not wipe it. Date-only pickers
        // keep DayPicker's midnight, and an unparseable value is left alone rather than merged.
        const withCurrentTimeOfDay = (date: Date): Date => {
          if (!showTime || Number.isNaN(dateValue.getTime())) {
            return date;
          }
          const dateWithTime = new Date(date);
          dateWithTime.setHours(dateValue.getHours(), dateValue.getMinutes(), dateValue.getSeconds(), dateValue.getMilliseconds());
          return dateWithTime;
        };

        const handleOnValueChange = (date: Date | undefined) => {
          const selectedDate = date ? withCurrentTimeOfDay(date) : undefined;
          if (useEpochTimestamp) {
            // Convert Date to epoch timestamp (milliseconds)
            const epochValue = selectedDate ? selectedDate.getTime() : undefined;
            field.onChange(
              isEpochTimeStampInString ?
                epochValue === undefined ?
                  ''
                : epochValue.toString()
              : epochValue,
            );
            onValueChange?.(epochValue);
          } else {
            field.onChange(selectedDate);
            onValueChange?.(selectedDate);
          }
        };

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
          <FormItem className={ cn('flex flex-col', formItemClassName) }>
            { label ?
              <FormLabel className={ `
                font-normal text-gray-600
                dark:text-gray-300
              ` }>{ label }</FormLabel>
            : null }
            <div className="flex flex-row gap-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={ 'outline' }
                      className={ cn('truncate pl-3 text-left font-normal', !field.value && 'text-muted-foreground', buttonClassName) }
                    >
                      { dateValue ? format(dateValue, buttonDisplayFormat) : <span>Pick a date</span> }
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={ 2 }>
                  <CalendarV2
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
              <FormDescription>{ description }</FormDescription>
            : null }
            <FormMessage />
          </FormItem>
        );
      } }
    />
  );
}
