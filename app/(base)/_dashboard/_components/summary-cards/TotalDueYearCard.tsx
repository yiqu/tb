import z from 'zod';
import { Suspense } from 'react';
import { SquareArrowDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getUSDFormatter } from '@/lib/number.utils';
import { Separator } from '@/components/ui/separator';
import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';
import { BillDueWithSubscriptionByYear } from '@/models/bills/bills.model';
import { getAllBillsByYearFromParamsCached } from '@/server/bills/bills.server';
import { BillSearchParams, billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { CardTitle, CardAction, CardFooter, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

import YearCardTrendPercent from './YearCardTrendPercent';
import DateRangeEpochDisplay from './DateRangeEpochDisplay';
import NextYearContentTextSection from './NextYearContentTextSection';
import CurrentYearContentTextSection from './CurrentYearContentTextSection';
import PreviousYearContentTextSection from './PreviousYearContentTextSection';

const usdFormatter = getUSDFormatter();

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default async function TotalDueYearCard({ searchParamsPromise }: Props) {
  let searchParams: BillSearchParams = await searchParamsPromise;
  const { selectedMonthYear } = searchParams; // e.g. 11/2025 or undefined
  const currentYearData: BillDueWithSubscriptionByYear = await getAllBillsByYearFromParamsCached(selectedMonthYear);

  return (
    <DisplayCard className="@container/card flex flex-col">
      <CardHeader>
        <CardDescription>
          <div className="flex flex-row items-center justify-start gap-x-2">
            <DateRangeEpochDisplay startDateEpoch={ currentYearData.startDateEpoch } endDateEpoch={ currentYearData.endDateEpoch } />
            <Typography>Year: { currentYearData.yearParams }</Typography>
          </div>
        </CardDescription>
        <CardTitle className={ `text-2xl font-semibold tabular-nums` }>{ usdFormatter.format(currentYearData.totalBillsCost) }</CardTitle>
        <CardAction>
          <Suspense fallback={ <TrendBadgeLoading /> }>
            <YearCardTrendPercent selectedMonthYear={ selectedMonthYear } currentYearData={ currentYearData } />
          </Suspense>
        </CardAction>
      </CardHeader>
      <CardContent className="flex grow flex-col justify-start gap-y-4">
        <Suspense fallback={ <SubTextLoading /> }>
          <CurrentYearContentTextSection selectedMonthYear={ selectedMonthYear } currentYearData={ currentYearData } />
        </Suspense>
        <Separator orientation="horizontal" className="w-full" />
        <Suspense fallback={ <SubTextLoading /> }>
          <PreviousYearContentTextSection selectedMonthYear={ selectedMonthYear } />
        </Suspense>
        <Separator orientation="horizontal" className="w-full" />
        <Suspense fallback={ <SubTextLoading /> }>
          <NextYearContentTextSection selectedMonthYear={ selectedMonthYear } />
        </Suspense>
      </CardContent>
      <CardFooter className=""></CardFooter>
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
  return <Skeleton className="h-12 w-full" />;
}
