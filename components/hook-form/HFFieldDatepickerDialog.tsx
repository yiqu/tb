/* eslint-disable no-unused-vars */
import { CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, addYears, subYears } from 'date-fns';
import { Path, Control, Controller, FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { toZonedWallClock, fromZonedWallClock, parseFieldValueInZone } from '@/lib/datepicker.utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/custom/popover';
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
  // Call sites already pass timeZone; it was previously swallowed by the DayPicker props spread.
  timeZone: zone = EST_TIME_ZONE,
}: HFDatepickerDialogProps<T> & React.ComponentProps<typeof DayPicker>) {
  return (
    <Controller
      name={ name }
      control={ control }
      render={ ({ field, fieldState }) => {
        // Everything below works in `zone`'s wall clock. dateValue is a shifted Date for DayPicker and
        // date-fns (both local-only); commit() turns a wall clock back into the real instant we save.
        const zonedValue = parseFieldValueInZone(field.value, zone, useEpochTimestamp);
        const dateValue = toZonedWallClock(zonedValue);

        let timeValue: string = '00:00:00'; // time format is HH:MM:SS
        if (showTime) {
          timeValue = format(dateValue, 'HH:mm:ss');
        }

        const commit = (wallClock: Date | undefined) => {
          const instant = wallClock ? fromZonedWallClock(wallClock, zone) : undefined;
          if (useEpochTimestamp) {
            // Convert the zoned wall clock to an epoch timestamp (milliseconds)
            const epochValue = instant ? instant.toMillis() : undefined;
            field.onChange(
              isEpochTimeStampInString ?
                epochValue === undefined ?
                  ''
                : epochValue.toString()
              : epochValue,
            );
            onValueChange?.(epochValue);
          } else {
            const dateOut = instant ? instant.toJSDate() : undefined;
            field.onChange(dateOut);
            onValueChange?.(dateOut);
          }
        };

        // DayPicker always hands back the picked day at midnight. When a time input is shown, carry
        // over the time it currently displays so picking a date does not wipe it; date-only pickers
        // keep midnight.
        const withCurrentTimeOfDay = (date: Date): Date => {
          if (!showTime) {
            return date;
          }
          const dateWithTime = new Date(date);
          dateWithTime.setHours(dateValue.getHours(), dateValue.getMinutes(), dateValue.getSeconds(), dateValue.getMilliseconds());
          return dateWithTime;
        };

        const handleOnValueChange = (date: Date | undefined) => {
          commit(date ? withCurrentTimeOfDay(date) : undefined);
        };

        const handleOnTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const time = e.target.value; //HH:mm:ss
          const date = new Date(dateValue);
          if (time) {
            date.setHours(Number(time.split(':')[0]), Number(time.split(':')[1]), Number(time.split(':')[2]));
            commit(date);
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
