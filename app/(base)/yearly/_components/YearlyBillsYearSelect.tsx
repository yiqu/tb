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
  const [yearParam, setYear] = useQueryState(
    'year',
    parseAsInteger.withOptions({
      history: 'push',
      scroll: false,
      shallow: false,
    }),
  );

  // show the picked year right away; the server-resolved year covers a missing or invalid param
  const displayedYear: number = yearParam !== null && years.includes(yearParam) ? yearParam : selectedYear;

  const handleOnValueChange = (value: string) => {
    const year: number = Number.parseInt(value);
    if (year === displayedYear) {
      return;
    }
    setYear(year);
  };

  return (
    <Select value={ `${displayedYear}` } onValueChange={ handleOnValueChange }>
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
