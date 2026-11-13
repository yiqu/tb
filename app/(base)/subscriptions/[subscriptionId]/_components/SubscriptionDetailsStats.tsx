'use client';

import { DateTime } from 'luxon';
import { Sigma, Wallet, CalendarDays, CalendarClock, CalendarRange } from 'lucide-react';

import { cn } from '@/lib/utils';
import useIsClient from '@/hooks/useIsClient';
import { Skeleton } from '@/components/ui/skeleton';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { getUSDFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import { SubscriptionDetailsStats as Stats, SubscriptionDetailsStatsBill } from '@/models/subscriptions/subscription-details-stats.model';

import SubscriptionDetailsStatTile from './SubscriptionDetailsStatTile';
import SubscriptionDetailsStatTileProgress from './SubscriptionDetailsStatTileProgress';
import SubscriptionDetailsSpendPerYearChart from './SubscriptionDetailsSpendPerYearChart';
import SubscriptionDetailsRunningTotalChart from './SubscriptionDetailsRunningTotalChart';
import SubscriptionDetailsBillStatusBreakdown from './SubscriptionDetailsBillStatusBreakdown';
import { formatStatsDate, getSubscriptionDetailsStats } from './subscription-details-stats.utils';

const usdFormatter = getUSDFormatter();

const TILES_GRID_CLASS_NAME = `
  grid w-full grid-cols-1 gap-3
  @md:grid-cols-2
  @3xl:grid-cols-6
  @6xl:grid-cols-5
`;

// five tiles: one column, then 2 + 2 + 1 wide, then 3 + 2, then all five in a row
const TILE_CLASS_NAME = '@3xl:col-span-2 @6xl:col-span-1';
const TILE_WIDE_CLASS_NAME = '@3xl:col-span-3 @6xl:col-span-1';
const TILE_LAST_CLASS_NAME = '@md:col-span-2 @3xl:col-span-3 @6xl:col-span-1';

const CHARTS_GRID_CLASS_NAME = `
  grid w-full grid-cols-1 gap-3
  @4xl:grid-cols-2
  @7xl:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,3fr)]
`;

export default function SubscriptionDetailsStats({ bills }: { bills: SubscriptionDetailsStatsBill[] }) {
  const isClient = useIsClient();

  // The page is prerendered and cached, but every number here is relative to today, so they are
  // worked out in the browser. Otherwise "this month" would be the month the page was cached in.
  if (!isClient) {
    return <SubscriptionDetailsStatsLoading />;
  }

  const stats: Stats = getSubscriptionDetailsStats(bills, DateTime.now().setZone(EST_TIME_ZONE).toMillis());

  return (
    <>
      <div className={ TILES_GRID_CLASS_NAME }>
        <SubscriptionDetailsStatTile
          className={ TILE_CLASS_NAME }
          label="Due this month"
          qualifier={ stats.currentMonthLabel }
          value={ usdFormatter.format(stats.thisMonth.cost) }
          icon={ <CalendarDays className="size-4" /> }
          footer={ <SubscriptionDetailsStatTileProgress period={ stats.thisMonth } /> }
        />
        <SubscriptionDetailsStatTile
          className={ TILE_CLASS_NAME }
          label="Due this year"
          qualifier={ `${stats.currentYear}` }
          value={ usdFormatter.format(stats.thisYear.cost) }
          icon={ <CalendarRange className="size-4" /> }
          footer={ <SubscriptionDetailsStatTileProgress period={ stats.thisYear } /> }
        />
        <SubscriptionDetailsStatTile
          className={ TILE_CLASS_NAME }
          label="All time"
          qualifier="past and upcoming"
          value={ usdFormatter.format(stats.allTime.cost) }
          icon={ <Sigma className="size-4" /> }
          footer={ <SubscriptionDetailsStatTileProgress period={ stats.allTime } /> }
        />
        <SubscriptionDetailsStatTile
          className={ TILE_WIDE_CLASS_NAME }
          label="Spent to date"
          value={ usdFormatter.format(stats.spentToDate.cost) }
          icon={ <Wallet className="size-4" /> }
          footer={
            <Typography variant="caption1" className="tabular-nums">
              { stats.spentToDate.count === 0 || stats.firstDueDate === null ?
                'No bills due yet'
              : `${stats.spentToDate.count} ${stats.spentToDate.count === 1 ? 'bill' : 'bills'} from ${formatStatsDate(stats.firstDueDate)} through today` }
            </Typography>
          }
        />
        <SubscriptionDetailsStatTile
          className={ TILE_LAST_CLASS_NAME }
          label="Upcoming"
          qualifier="after today"
          value={ usdFormatter.format(stats.upcoming.cost) }
          icon={ <CalendarClock className="size-4" /> }
          footer={
            <Typography variant="caption1" className="tabular-nums">
              { stats.nextDueDate === null ?
                'No future bills'
              : `${stats.upcoming.count} ${stats.upcoming.count === 1 ? 'bill' : 'bills'}, next due ${formatStatsDate(stats.nextDueDate)}` }
            </Typography>
          }
        />
      </div>
      { stats.allTime.count > 0 ?
        <div className={ CHARTS_GRID_CLASS_NAME }>
          <SubscriptionDetailsSpendPerYearChart perYear={ stats.perYear } currentYear={ stats.currentYear } />
          <SubscriptionDetailsRunningTotalChart runningTotal={ stats.runningTotal } />
          <SubscriptionDetailsBillStatusBreakdown statusBreakdown={ stats.statusBreakdown } totalCount={ stats.allTime.count } />
        </div>
      : null }
    </>
  );
}

function SubscriptionDetailsStatsLoading() {
  return (
    <>
      <div className={ TILES_GRID_CLASS_NAME }>
        { [TILE_CLASS_NAME, TILE_CLASS_NAME, TILE_CLASS_NAME, TILE_WIDE_CLASS_NAME, TILE_LAST_CLASS_NAME].map((tileClassName, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton key={ index } className={ cn('h-31.5 w-full', tileClassName) } />
        )) }
      </div>
      <div className={ CHARTS_GRID_CLASS_NAME }>
        { ['@4xl:col-span-2 @7xl:col-span-1', '', ''].map((chartClassName, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton key={ index } className={ cn('h-80 w-full', chartClassName) } />
        )) }
      </div>
    </>
  );
}
