'use client';

import { DateTime } from 'luxon';
import { Area, Line, XAxis, YAxis, Tooltip, ComposedChart, CartesianGrid, ReferenceLine, ResponsiveContainer } from 'recharts';

import Typography from '@/components/typography/Typography';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { getUSDFormatter } from '@/lib/number.utils';
import { SubscriptionDetailsStatsRunningTotalNode } from '@/models/subscriptions/subscription-details-stats.model';

import { formatStatsDate, formatCompactUsd } from './subscription-details-stats.utils';
import SubscriptionDetailsChartCard, {
  ChartLegend,
  ChartTooltipCard,
  CHART_COLOR_SPENT,
  CHART_AXIS_TICK_STYLE,
} from './SubscriptionDetailsChartCard';

const usdFormatter = getUSDFormatter();

export default function SubscriptionDetailsRunningTotalChart({ runningTotal }: { runningTotal: SubscriptionDetailsStatsRunningTotalNode[] }) {
  const hasUpcoming: boolean = runningTotal.some((node) => node.upcoming !== null);
  // the end of today, the same cut-off the stats use, so a bill due later today sits before the marker
  const todayMillis: number = DateTime.now().setZone(EST_TIME_ZONE).endOf('day').toMillis();
  const firstDueDate: number = runningTotal[0].dueDate;
  const lastDueDate: number = runningTotal[runningTotal.length - 1].dueDate;
  const isTodayInRange: boolean = todayMillis > firstDueDate && todayMillis < lastDueDate;
  // a single bill has no width to draw a line across, so give the axis a month on either side
  const isSinglePoint: boolean = firstDueDate === lastDueDate;
  const domain: [number, number] =
    isSinglePoint ?
      [
        DateTime.fromMillis(firstDueDate, { zone: EST_TIME_ZONE }).minus({ months: 1 }).toMillis(),
        DateTime.fromMillis(firstDueDate, { zone: EST_TIME_ZONE }).plus({ months: 1 }).toMillis(),
      ]
    : [firstDueDate, lastDueDate];

  return (
    <SubscriptionDetailsChartCard
      title="Running total"
      description="How the total cost has added up, bill by bill."
      legend={
        hasUpcoming ?
          <div className="flex flex-row items-center gap-x-3">
            <ChartLegend items={ [{ label: 'Spent', color: CHART_COLOR_SPENT }] } />
            <div className="flex flex-row items-center gap-x-1.5">
              <span className="w-4 border-t-2 border-dashed" style={ { borderColor: CHART_COLOR_SPENT } } />
              <Typography variant="caption1">Upcoming</Typography>
            </div>
          </div>
        : undefined
      }
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%" initialDimension={ { width: 400, height: 256 } }>
          <ComposedChart data={ runningTotal } margin={ { top: 20, right: 12, left: 0, bottom: 0 } }>
            <CartesianGrid vertical={ false } stroke="var(--border)" />
            <XAxis
              dataKey="dueDate"
              type="number"
              scale="time"
              domain={ domain }
              tickCount={ 5 }
              tickLine={ false }
              axisLine={ { stroke: 'var(--border)' } }
              tick={ { style: CHART_AXIS_TICK_STYLE } }
              tickFormatter={ (value: number) => formatStatsDate(value, 'LLL yy') }
              minTickGap={ 24 }
            />
            <YAxis
              width={ 52 }
              tickLine={ false }
              axisLine={ false }
              tick={ { style: CHART_AXIS_TICK_STYLE } }
              tickFormatter={ (value: number) => formatCompactUsd(value) }
            />
            <Tooltip cursor={ { stroke: 'var(--muted-foreground)', strokeDasharray: '3 3' } } animationDuration={ 0 } content={ <RunningTotalTooltip /> } />
            { isTodayInRange ?
              <ReferenceLine
                x={ todayMillis }
                stroke="var(--muted-foreground)"
                strokeDasharray="3 3"
                label={ { value: 'Today', position: 'top', style: CHART_AXIS_TICK_STYLE } }
              />
            : null }
            <Area
              dataKey="spent"
              type="stepAfter"
              stroke={ CHART_COLOR_SPENT }
              strokeWidth={ 2 }
              fill={ CHART_COLOR_SPENT }
              fillOpacity={ 0.12 }
              dot={ runningTotal.length <= 24 ? { r: 3, fill: CHART_COLOR_SPENT, stroke: 'var(--card)', strokeWidth: 2 } : false }
              activeDot={ { r: 5, stroke: 'var(--card)', strokeWidth: 2 } }
              isAnimationActive={ false }
            />
            <Line
              dataKey="upcoming"
              type="stepAfter"
              stroke={ CHART_COLOR_SPENT }
              strokeWidth={ 2 }
              strokeDasharray="5 4"
              dot={ false }
              activeDot={ { r: 5, stroke: 'var(--card)', strokeWidth: 2 } }
              isAnimationActive={ false }
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </SubscriptionDetailsChartCard>
  );
}

function RunningTotalTooltip({ active, payload }: { active?: boolean; payload?: { payload: SubscriptionDetailsStatsRunningTotalNode }[] }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const node: SubscriptionDetailsStatsRunningTotalNode = payload[0].payload;
  const isUpcoming: boolean = node.spent === null;
  const total: number = node.spent ?? node.upcoming ?? 0;

  return (
    <ChartTooltipCard
      title={ formatStatsDate(node.dueDate) }
      rows={ [{ label: isUpcoming ? 'Total by then' : 'Total spent', value: usdFormatter.format(total), color: CHART_COLOR_SPENT }] }
    />
  );
}
