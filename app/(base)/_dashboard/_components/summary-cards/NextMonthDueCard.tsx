import z from 'zod';
import { DateTime } from 'luxon';
import { Suspense } from 'react';
import { SquareArrowRight } from 'lucide-react';

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
import NextMonthSubTextSection from './NextMonthSubTextSection';
import { getNextMonthLuxon, appendMonthAndYearToSearchParams } from '../dashboard.utils';

const usdFormatter = getUSDFormatter();

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default async function NextMonthDueCard({ searchParamsPromise }: Props) {
  // get the current month and year from server
  const dateData: CurrentMonthDateData = await getCurrentMonthDateDataCached();
  const dateParamsData: BillSearchParams = await dateData.dateSearchParamsPromise;
  let { nextMonth, nextMonthYear } = dateData;

  // use server month and year if searchParams are not set
  let searchParams: BillSearchParams = await searchParamsPromise;
  searchParams = appendMonthAndYearToSearchParams(searchParams, dateParamsData);
  const monthYearParams: string | undefined = searchParams.selectedMonthYear;

  if (monthYearParams) {
    const [month, year] = monthYearParams.split('/');
    const nextMonthLuxon: DateTime = getNextMonthLuxon(Number.parseInt(month), Number.parseInt(year));
    nextMonth = nextMonthLuxon.month;
    nextMonthYear = nextMonthLuxon.year;
  }

  const nextMonthData: BillDueWithSubscriptionByMonthAndYear = await getAllBillsByMonthAndYearCached(
    nextMonth.toString(),
    nextMonthYear.toString(),
  );

  const currentMonthData: BillDueWithSubscriptionByMonthAndYear = await getAllBillsByMonthAndYearCached(
    searchParams.month,
    searchParams.year,
  );

  return (
    <DisplayCard className="@container/card">
      <CardHeader>
        <CardDescription>
          <div className="flex flex-row items-center justify-start gap-x-2">
            <SquareArrowRight className="size-5" />
            <Typography>
              Next Month: { nextMonth }/{ nextMonthYear }
            </Typography>
          </div>
        </CardDescription>
        <CardTitle className={ `text-2xl font-semibold tabular-nums` }>{ usdFormatter.format(nextMonthData.totalBillsCost) }</CardTitle>
        <CardAction>
          <Suspense fallback={ <TrendBadgeLoading /> }>
            { /* <CardTrendPercent monthData={ dateData } searchParamsPromise={ searchParamsPromise } currentMonthData={ nextMonthData } /> */ }
          </Suspense>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <Suspense fallback={ <SubTextLoading /> }>
          <NextMonthSubTextSection monthData={ dateData } searchParamsPromise={ searchParamsPromise } currentMonthData={ currentMonthData } />
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
