import z from 'zod';
import { Suspense } from 'react';
import { SquareArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getUSDFormatter } from '@/lib/number.utils';
import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';
import { BillDueWithSubscriptionByMonthAndYear } from '@/models/bills/bills.model';
import { getAllBillsByMonthAndYearParamsCached } from '@/server/bills/bills.server';
import { BillSearchParams, billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { CardTitle, CardAction, CardFooter, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

import NextMonthFooterSection from './NextMonthFooterSection';
import NextMonthSubTextSection from './NextMonthSubTextSection';
import NextMonthTimeRemainDuration from './NextMonthTimeRemainDuration';

const usdFormatter = getUSDFormatter();

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default async function NextMonthDueCard({ searchParamsPromise }: Props) {
  let searchParams: BillSearchParams = await searchParamsPromise;
  const { selectedMonthYear } = searchParams; // e.g. 11/2025 or undefined
  const currentMonthData: BillDueWithSubscriptionByMonthAndYear = await getAllBillsByMonthAndYearParamsCached(selectedMonthYear);
  const nextMonthData: BillDueWithSubscriptionByMonthAndYear = await getAllBillsByMonthAndYearParamsCached(selectedMonthYear, 1);

  return (
    <DisplayCard className="@container/card flex flex-col">
      <CardHeader>
        <CardDescription>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-start gap-x-2">
              <SquareArrowRight className="size-5" />
              <Typography>
                Next Month: { nextMonthData.monthParams }/{ nextMonthData.yearParams }
              </Typography>
            </div>
            <NextMonthTimeRemainDuration selectedMonthYear={ selectedMonthYear } nextMonthData={ nextMonthData } />
          </div>
        </CardDescription>
        <CardTitle>
          <Typography variant="h3" className="tabular-nums">
            { usdFormatter.format(nextMonthData.totalBillsCost) }
          </Typography>
        </CardTitle>
        <CardAction>
          <Suspense fallback={ <TrendBadgeLoading /> }>
            { /* <CardTrendPercent monthData={ dateData } searchParamsPromise={ searchParamsPromise } currentMonthData={ nextMonthData } /> */ }
          </Suspense>
        </CardAction>
      </CardHeader>
      <CardContent className="grow">
        <Suspense fallback={ <SubTextLoading /> }>
          <NextMonthSubTextSection selectedMonthYear={ selectedMonthYear } currentMonthData={ currentMonthData } />
        </Suspense>
      </CardContent>
      <CardFooter className="">
        <Suspense fallback={ <SubTextLoadingSmall /> }>
          <NextMonthFooterSection selectedMonthYear={ selectedMonthYear } currentMonthData={ currentMonthData } />
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

function SubTextLoadingSmall() {
  return <Skeleton className="h-5 w-full" />;
}

function SubTextLoading() {
  return <Skeleton className="h-24 w-full" />;
}
