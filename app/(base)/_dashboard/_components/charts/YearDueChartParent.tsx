import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import DisplayCard from '@/shared/components/DisplayCard';
import { DashboardYearBillsChartData } from '@/models/charts/chart.model';
import { CardAction, CardHeader, CardContent } from '@/components/ui/card';
import { getEntireBillsChartDataCached } from '@/server/bills/bills.server';

import YearDueChart from './YearDueChart';
import YearDueChartTitle from './YearDueChartTitle';
import YearDueChartDescription from './YearDueChartDescription';

export default function YearDueChartParent() {
  const chartDataPromise: Promise<DashboardYearBillsChartData> = getEntireBillsChartDataCached();

  return (
    <DisplayCard className="">
      <CardHeader>
        <Suspense fallback={ <ChartTitleLoading /> }>
          <YearDueChartTitle chartDataPromise={ chartDataPromise } />
        </Suspense>
        <Suspense fallback={ <ChartDescriptionLoading /> }>
          <YearDueChartDescription chartDataPromise={ chartDataPromise } />
        </Suspense>
        <CardAction></CardAction>
      </CardHeader>
      <CardContent className="grow">
        <Suspense fallback={ <ChartLoading /> }>
          <YearDueChart chartDataPromise={ chartDataPromise } />
        </Suspense>
      </CardContent>
    </DisplayCard>
  );
}

function ChartLoading() {
  return <Skeleton className="h-148 w-full" />;
}

function ChartDescriptionLoading() {
  return <Skeleton className="h-5 w-[1600px]" />;
}

function ChartTitleLoading() {
  return <Skeleton className="h-9 w-[1600px]" />;
}
