'use client';

import { X } from 'lucide-react';
import { parseAsString, parseAsInteger, useQueryStates } from 'nuqs';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectValue,
  SelectContent,
  SelectTrigger,
  SelectSeparator,
} from '@/components/ui/select';

const YEAR_OPTIONS = [
  { label: '2021', value: '2021' },
  { label: '2022', value: '2022' },
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' },
  { label: '2027', value: '2027' },
  { label: '2028', value: '2028' },
  { label: '2029', value: '2029' },
  { label: '2030', value: '2030' },
];

const DYNAMIC_YEAR_OPTIONS = [
  { label: 'Future (include today)', value: 'future-include-today' },
  { label: 'Past (include today)', value: 'past-include-today' },
  { label: 'Future (include current year)', value: 'future-include-current-year' },
  { label: 'Past (include current year)', value: 'past-include-current-year' },
];

const MONTH_OPTIONS = [
  { label: 'January / 1', value: '1' },
  { label: 'February / 2', value: '2' },
  { label: 'March / 3', value: '3' },
  { label: 'April / 4', value: '4' },
  { label: 'May / 5', value: '5' },
  { label: 'June / 6', value: '6' },
  { label: 'July / 7', value: '7' },
  { label: 'August / 8', value: '8' },
  { label: 'September / 9', value: '9' },
  { label: 'October / 10', value: '10' },
  { label: 'November / 11', value: '11' },
  { label: 'December / 12', value: '12' },
];

export default function BillsActionBarDueDateFilter() {
  const [selectedDueDate, setSelectedDueDate] = useQueryStates(
    {
      year: parseAsString,
      month: parseAsString,
      page: parseAsInteger
        .withOptions({
          history: 'push',
          scroll: false,
          shallow: false,
        })
        .withDefault(1),
    },
    {
      history: 'push',
      scroll: false,
      shallow: false,
    },
  );

  const handleOnDueDateYearChange = (year: string) => {
    setSelectedDueDate({
      year: year === 'none' ? null : year,
      month: selectedDueDate.month === 'none' ? null : selectedDueDate.month,
      page: 1,
    });
  };

  const handleOnDueDateMonthChange = (month: string) => {
    setSelectedDueDate({
      year: selectedDueDate.year === 'none' ? null : selectedDueDate.year,
      month: month === 'none' ? null : month,
      page: 1,
    });
  };

  const handleClearYearValue = () => {
    setSelectedDueDate({
      year: null,
      month: selectedDueDate.month === 'none' ? null : selectedDueDate.month,
      page: 1,
    });
  };

  const handleClearMonthValue = () => {
    setSelectedDueDate({
      year: selectedDueDate.year === 'none' ? null : selectedDueDate.year,
      month: null,
      page: 1,
    });
  };

  const isYearValueSelected: boolean = selectedDueDate.year !== null && selectedDueDate.year !== 'none';
  const isMonthValueSelected: boolean = selectedDueDate.month !== null && selectedDueDate.month !== 'none';

  return (
    <div className="flex flex-row items-center justify-start gap-x-2">
      <div className="relative">
        <Select onValueChange={ handleOnDueDateYearChange } value={ selectedDueDate.year === null ? '' : selectedDueDate.year }>
          <SelectTrigger className={ cn('min-w-[9rem] cursor-pointer bg-card font-medium select-none', isYearValueSelected && `pr-7`) }>
            <SelectValue placeholder="Due date year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Reset</SelectLabel>
              <SelectItem key="clear" value="none" onClick={ handleClearYearValue }>
                Clear year
              </SelectItem>
            </SelectGroup>

            <SelectSeparator />

            <SelectGroup>
              <SelectLabel>Dynamic</SelectLabel>
              { DYNAMIC_YEAR_OPTIONS.map((option) => (
                <SelectItem key={ option.value } value={ option.value }>
                  { option.label }
                </SelectItem>
              )) }
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Year</SelectLabel>
              { YEAR_OPTIONS.map((option) => (
                <SelectItem key={ option.value } value={ option.value }>
                  { option.label }
                </SelectItem>
              )) }
            </SelectGroup>
          </SelectContent>
        </Select>
        { isYearValueSelected ?
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={ `
              absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 p-0
              hover:bg-background
            ` }
            onClick={ handleClearYearValue }
          >
            <X className="size-4" />
          </Button>
        : null }
      </div>
      <div className="relative">
        <Select onValueChange={ handleOnDueDateMonthChange } value={ selectedDueDate.month === null ? '' : selectedDueDate.month }>
          <SelectTrigger className={ cn('min-w-[9rem] cursor-pointer bg-card font-medium select-none', isMonthValueSelected && `pr-7`) }>
            <SelectValue placeholder="Due date month" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Reset</SelectLabel>
              <SelectItem key="clear" value="none" onClick={ handleClearMonthValue }>
                Clear month
              </SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Month</SelectLabel>
              { MONTH_OPTIONS.map((option) => (
                <SelectItem key={ option.value } value={ option.value }>
                  { option.label }
                </SelectItem>
              )) }
            </SelectGroup>
          </SelectContent>
        </Select>
        { isMonthValueSelected ?
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={ `
              absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 p-0
              hover:bg-background
            ` }
            onClick={ handleClearMonthValue }
          >
            <X className="size-4" />
          </Button>
        : null }
      </div>
    </div>
  );
}
