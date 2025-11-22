import z from 'zod';
import { Suspense } from 'react';
import { cacheLife } from 'next/cache';
import { SquareArrowDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getUSDFormatter } from '@/lib/number.utils';
import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';
import { BillSearchParams, billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { CardTitle, CardAction, CardFooter, CardHeader, CardDescription } from '@/components/ui/card';
import { CurrentMonthDateData, BillDueWithSubscriptionByMonthAndYear } from '@/models/bills/bills.model';
import { getCurrentMonthDateDataCached, getAllBillsByMonthAndYearCached } from '@/server/bills/bills.server';

import CardTrendPercent from './CardTrendPercent';
import { appendMonthAndYearToSearchParams } from '../dashboard.utils';
import CurrentMonthSubTextSection from './CurrentMonthSubTextSection';

const usdFormatter = getUSDFormatter();

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default async function TotalDueMonthCard({ searchParamsPromise }: Props) {
  'use cache';
  cacheLife('weeks');

  // get the current month and year from server
  const dateData: CurrentMonthDateData = await getCurrentMonthDateDataCached();
  const dateParamsData: BillSearchParams = await dateData.dateSearchParamsPromise;

  // use server month and year if searchParams are not set
  let searchParams: BillSearchParams = await searchParamsPromise;
  searchParams = appendMonthAndYearToSearchParams(searchParams, dateParamsData);

  const currentMonthData: BillDueWithSubscriptionByMonthAndYear = await getAllBillsByMonthAndYearCached(
    searchParams.month,
    searchParams.year,
  );

  return (
    <DisplayCard className="@container/card">
      <CardHeader>
        <CardDescription>
          <div className="flex flex-row items-center justify-start gap-x-2">
            <SquareArrowDown className="size-5" />
            <Typography>This Month</Typography>
          </div>
        </CardDescription>
        <CardTitle className={ `text-2xl font-semibold tabular-nums` }>{ usdFormatter.format(currentMonthData.totalBillsCost) }</CardTitle>
        <CardAction>
          <Suspense fallback={ <TrendBadgeLoading /> }>
            <CardTrendPercent monthData={ dateData } searchParamsPromise={ searchParamsPromise } currentMonthData={ currentMonthData } />
          </Suspense>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <Suspense fallback={ <SubTextLoading /> }>
          <CurrentMonthSubTextSection monthData={ dateData } searchParamsPromise={ searchParamsPromise } currentMonthData={ currentMonthData } />
        </Suspense>
      </CardFooter>
    </DisplayCard>
  );
}

function TrendBadgeLoading() {
  return (
    <Badge variant="outline">
      <Skeleton className="h-4 w-[50px]" />
    </Badge>
  );
}

function SubTextLoading() {
  return <Skeleton className="h-11.5 w-full" />;
}
