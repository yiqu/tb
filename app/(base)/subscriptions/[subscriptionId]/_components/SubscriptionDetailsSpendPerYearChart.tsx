'use client';

import { Bar, Cell, XAxis, YAxis, Tooltip, BarChart, LabelList, CartesianGrid, ResponsiveContainer, XAxisTickContentProps } from 'recharts';

import { getUSDFormatter } from '@/lib/number.utils';
import { SubscriptionDetailsStatsYearNode } from '@/models/subscriptions/subscription-details-stats.model';

import { CHART_WIDE_CLASS_NAME } from './SubscriptionDetailsStatsLoading';
import { formatCompactUsd } from './subscription-details-stats.utils';
import SubscriptionDetailsChartCard, {
  ChartLegend,
  ChartTooltipCard,
  CHART_COLOR_SPENT,
  CHART_AXIS_TICK_STYLE,
  CHART_COLOR_UPCOMING,
} from './SubscriptionDetailsChartCard';

const usdFormatter = getUSDFormatter();

const TOTAL_LABEL_STYLE = { ...CHART_AXIS_TICK_STYLE, fill: 'var(--foreground)', fontWeight: 600 } as const;

function formatTotalLabel(value: unknown): string {
  return typeof value === 'number' && value > 0 ? formatCompactUsd(value) : '';
}

interface Props {
  perYear: SubscriptionDetailsStatsYearNode[];
  currentYear: number;
}

export default function SubscriptionDetailsSpendPerYearChart({ perYear, currentYear }: Props) {
  const hasUpcoming: boolean = perYear.some((node) => node.upcoming > 0);
  // the year's total is labelled on whichever segment ends up on top of the stack
  const data = perYear.map((node) => ({
    ...node,
    spentLabel: node.upcoming > 0 ? null : node.total,
    upcomingLabel: node.upcoming > 0 ? node.total : null,
  }));

  return (
    <SubscriptionDetailsChartCard
      title="Spend per year"
      description="Total cost of the bills due in each year, all time."
      className={ CHART_WIDE_CLASS_NAME }
      legend={
        hasUpcoming ?
          <ChartLegend
            items={ [
              { label: 'Spent', color: CHART_COLOR_SPENT },
              { label: 'Upcoming', color: CHART_COLOR_UPCOMING },
            ] }
          />
        : undefined
      }
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%" initialDimension={ { width: 480, height: 256 } }>
          <BarChart data={ data } margin={ { top: 20, right: 8, left: 0, bottom: 0 } } barCategoryGap="25%">
            <CartesianGrid vertical={ false } stroke="var(--border)" />
            <XAxis
              dataKey="year"
              tickLine={ false }
              axisLine={ { stroke: 'var(--border)' } }
              tick={ ({ x, y, payload }: XAxisTickContentProps) => (
                <text
                  x={ x }
                  y={ y }
                  dy={ 14 }
                  textAnchor="middle"
                  style={ { ...CHART_AXIS_TICK_STYLE, fontWeight: payload.value === currentYear ? 700 : 400 } }
                >
                  { payload.value }
                </text>
              ) }
            />
            <YAxis
              width={ 52 }
              tickLine={ false }
              axisLine={ false }
              tick={ { style: CHART_AXIS_TICK_STYLE } }
              tickFormatter={ (value: number) => formatCompactUsd(value) }
            />
            <Tooltip cursor={ { fill: 'var(--muted)', opacity: 0.6 } } animationDuration={ 0 } content={ <YearTooltip /> } />
            <Bar dataKey="spent" stackId="year" fill={ CHART_COLOR_SPENT } maxBarSize={ 56 } isAnimationActive={ false }>
              { perYear.map((node) => (
                // the spent segment is the top of the stack when the year has nothing upcoming
                <Cell key={ node.year } radius={ (node.upcoming > 0 ? 0 : [4, 4, 0, 0]) as unknown as number } />
              )) }
              <LabelList dataKey="spentLabel" position="top" formatter={ formatTotalLabel } style={ TOTAL_LABEL_STYLE } />
            </Bar>
            <Bar
              dataKey="upcoming"
              stackId="year"
              fill={ CHART_COLOR_UPCOMING }
              radius={ [4, 4, 0, 0] }
              maxBarSize={ 56 }
              isAnimationActive={ false }
            >
              <LabelList dataKey="upcomingLabel" position="top" formatter={ formatTotalLabel } style={ TOTAL_LABEL_STYLE } />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SubscriptionDetailsChartCard>
  );
}

function YearTooltip({ active, payload }: { active?: boolean; payload?: { payload: SubscriptionDetailsStatsYearNode }[] }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const node: SubscriptionDetailsStatsYearNode = payload[0].payload;
  const rows = [{ label: 'Spent', value: usdFormatter.format(node.spent), color: CHART_COLOR_SPENT }];
  if (node.upcoming > 0) {
    rows.push(
      { label: 'Upcoming', value: usdFormatter.format(node.upcoming), color: CHART_COLOR_UPCOMING },
      { label: 'Total', value: usdFormatter.format(node.total), color: '' },
    );
  }

  return <ChartTooltipCard title={ `${node.year}, ${node.count} ${node.count === 1 ? 'bill' : 'bills'}` } rows={ rows } />;
}
