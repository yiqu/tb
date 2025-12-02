import z from 'zod';
import { Suspense } from 'react';
import { SquareArrowDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getUSDFormatter } from '@/lib/number.utils';
import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';
import { BillDueWithSubscriptionByMonthAndYear } from '@/models/bills/bills.model';
import { getAllBillsByMonthAndYearParamsCached } from '@/server/bills/bills.server';
import { BillSearchParams, billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { CardTitle, CardAction, CardFooter, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

import CardTrendPercent from './CardTrendPercent';
import CurrentMonthFooterSection from './CurrentMonthFooterSection';
import CurrentMonthSubTextSection from './CurrentMonthSubTextSection';
import OutstandingBillsGroupBadge from '@/components/sidebar/outstanding-group/OutstandingBillsGroupBadge';

const usdFormatter = getUSDFormatter();

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default async function TotalDueMonthCard({ searchParamsPromise }: Props) {
  let searchParams: BillSearchParams = await searchParamsPromise;
  const { selectedMonthYear } = searchParams; // e.g. 11/2025 or undefined
  const currentMonthData: BillDueWithSubscriptionByMonthAndYear = await getAllBillsByMonthAndYearParamsCached(selectedMonthYear);

  return (
    <DisplayCard className="@container/card flex flex-col">
      <CardHeader>
        <CardDescription>
          <div className="flex flex-row items-center justify-start gap-x-2">
            <SquareArrowDown className="size-5" />
            <Typography>
              Month: { currentMonthData.monthParams }/{ currentMonthData.yearParams }
            </Typography>
          </div>
        </CardDescription>
        <CardTitle>
          <Typography variant="h3" className="tabular-nums">
            { usdFormatter.format(currentMonthData.totalBillsCost) }
          </Typography>
        </CardTitle>
        <CardAction>
          <Suspense fallback={ <TrendBadgeLoading /> }>
            <CardTrendPercent selectedMonthYear={ selectedMonthYear } currentMonthData={ currentMonthData } />
          </Suspense>
        </CardAction>
      </CardHeader>
      <CardContent className="grow">
         <Suspense>
          <OutstandingBillsGroupBadge />
         </Suspense>
        <Suspense fallback={ <SubTextLoading /> }>
          <CurrentMonthSubTextSection selectedMonthYear={ selectedMonthYear } currentMonthData={ currentMonthData } />
        </Suspense>
      </CardContent>
      <CardFooter className="">
        <Suspense fallback={ <SubTextLoadingSmall /> }>
          <CurrentMonthFooterSection selectedMonthYear={ selectedMonthYear } currentMonthData={ currentMonthData } />
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
