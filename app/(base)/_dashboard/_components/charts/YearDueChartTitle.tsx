import { DateTime } from 'luxon';
import { cacheTag, cacheLife } from 'next/cache';
import humanizeDuration from 'humanize-duration';

import { CardTitle } from '@/components/ui/card';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import Typography from '@/components/typography/Typography';
import { CACHE_TAG_BILL_DUES_ALL } from '@/constants/constants';
import { DashboardYearBillsChartData } from '@/models/charts/chart.model';

export default async function YearDueChartTitle({ chartDataPromise }: { chartDataPromise: Promise<DashboardYearBillsChartData> }) {
  'use cache';
  cacheLife('max');
  cacheTag(CACHE_TAG_BILL_DUES_ALL);

  const chartData: DashboardYearBillsChartData = await chartDataPromise;
  const firstLuxonDueDate = Number.parseInt(chartData.firstBillDue?.dueDate ?? '0');
  const lastLuxonDueDate = Number.parseInt(chartData.lastBillDue?.dueDate ?? '0');

  const initDateRange = DateTime.fromMillis(firstLuxonDueDate, {
    zone: EST_TIME_ZONE,
  }).toLocaleString(DateTime.DATE_SHORT);

  const endDateRange = DateTime.fromMillis(lastLuxonDueDate, {
    zone: EST_TIME_ZONE,
  }).toLocaleString(DateTime.DATE_SHORT);

  const rangeDuration = humanizeDuration(lastLuxonDueDate - firstLuxonDueDate, { largest: 2, round: true });

  return (
    <CardTitle className={ `flex w-full flex-row items-center justify-between` }>
      <Typography variant="h4" className={ `` }>
        All Time Monthly Cost
      </Typography>
      <Typography variant="h4" className={ `tabular-nums` }>
        { initDateRange } - { endDateRange } (~{ rangeDuration })
      </Typography>
    </CardTitle>
  );
}
