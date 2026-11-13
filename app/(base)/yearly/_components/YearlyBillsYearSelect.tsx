'use client';

import { CalendarRange } from 'lucide-react';
import { useQueryState, parseAsInteger } from 'nuqs';

import Typography from '@/components/typography/Typography';
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from '@/components/ui/select';

interface YearlyBillsYearSelectProps {
  years: number[];
  selectedYear: number;
}

export default function YearlyBillsYearSelect({ years, selectedYear }: YearlyBillsYearSelectProps) {
  const [, setYear] = useQueryState(
    'year',
    parseAsInteger.withOptions({
      history: 'push',
      scroll: false,
      shallow: false,
    }),
  );

  const handleOnValueChange = (value: string) => {
    const year: number = Number.parseInt(value);
    if (year === selectedYear) {
      return;
    }
    setYear(year);
  };

  return (
    <Select value={ `${selectedYear}` } onValueChange={ handleOnValueChange }>
      <SelectTrigger className="w-[160px]" aria-label="Select year">
        <CalendarRange />
        <SelectValue placeholder="Year" />
      </SelectTrigger>
      <SelectContent>
        { years.map((year: number) => (
          <SelectItem key={ year } value={ `${year}` }>
            <Typography variant="span1">{ year }</Typography>
          </SelectItem>
        )) }
      </SelectContent>
    </Select>
  );
}
