'use client';

import z from 'zod';
import { DateTime } from 'luxon';
import { use, useState } from 'react';

import useIsClient from '@/hooks/useIsClient';
import { Skeleton } from '@/components/ui/skeleton';
import MonthIcon from '@/components/month/MonthIcon';
import { MONTH_NAMES, EST_TIME_ZONE } from '@/lib/general.utils';
import Typography, { TypographyProps } from '@/components/typography/Typography';
import { BillSearchParams, billSearchParamsSchema } from '@/validators/bills/bill.schema';

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
} & TypographyProps;

export default function CurrentMonthText({ searchParamsPromise, ...rest }: Props) {
  const isClient = useIsClient();

  const searchParams: BillSearchParams = use(searchParamsPromise);
  const currentDateLuxon = DateTime.now().setZone(EST_TIME_ZONE);
  const currentMonthName = currentDateLuxon.month;
  const currentYear = currentDateLuxon.year;
  const selectedMonthYear: string = searchParams.selectedMonthYear ?? `${currentMonthName}/${currentYear}`;
  const monthNumber: string = selectedMonthYear.split('/')[0];

  const [_titleClicked, setTitleClicked] = useState(false);

  const handleOnTitleClick = () => {
    setTitleClicked((prev) => {
      return !prev;
    });
  };

  if (!isClient) {
    return <Skeleton className="h-8 w-29" />;
  }

  return (
    <div className="flex flex-row items-center gap-x-2">
      <MonthIcon month={ monthNumber } height={ 30 } />
      <Typography { ...rest } onClick={ handleOnTitleClick }>
        { MONTH_NAMES[Number.parseInt(monthNumber) - 1] } <span className="ml-1 text-muted-foreground">({ selectedMonthYear })</span>
      </Typography>
    </div>
  );
}
