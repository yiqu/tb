'use client';

import { CalendarRange } from 'lucide-react';
import { useQueryState, parseAsString } from 'nuqs';

import Typography from '@/components/typography/Typography';
import { yearlyBillsSearchParamsSchema } from '@/validators/bills/yearly-bills.schema';
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from '@/components/ui/select';

interface YearlyBillsYearSelectProps {
  years: number[];
  selectedYear: number;
}

export default function YearlyBillsYearSelect({ years, selectedYear }: YearlyBillsYearSelectProps) {
  const [yearParam, setYear] = useQueryState(
    'year',
    parseAsString.withOptions({
      history: 'push',
      scroll: false,
      shallow: false,
    }),
  );

  // validate the URL year with the same schema as the server, so an invalid year param is ignored
  const parsedParam = yearlyBillsSearchParamsSchema.safeParse({ year: yearParam ?? undefined });
  const validParamYear: number | undefined = parsedParam.success ? parsedParam.data.year : undefined;

  // show the picked year right away; the server-resolved year covers a missing or invalid param
  const displayedYear: number = validParamYear !== undefined && years.includes(validParamYear) ? validParamYear : selectedYear;

  const handleOnValueChange = (value: string) => {
    if (value === yearParam) {
      return;
    }
    setYear(value);
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
