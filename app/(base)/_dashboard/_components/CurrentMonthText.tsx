'use client';

import z from 'zod';
import { DateTime } from 'luxon';
import { use, useState } from 'react';

import useIsClient from '@/hooks/useIsClient';
import { Skeleton } from '@/components/ui/skeleton';
import { EST_TIME_ZONE } from '@/lib/general.utils';
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

  const [titleClicked, setTitleClicked] = useState(false);

  const handleOnTitleClick = () => {
    setTitleClicked((prev) => {
      return !prev;
    });
  };

  if (!isClient) {
    return <Skeleton className="h-8 w-29" />;
  }

  return (
    <>
      <Typography { ...rest } onClick={ handleOnTitleClick }>
        { selectedMonthYear } <span className="ml-1 text-muted-foreground">{ '' }</span>
      </Typography>
    </>
  );
}
