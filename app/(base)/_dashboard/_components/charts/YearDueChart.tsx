/* eslint-disable react/no-array-index-key */
'use client';

import { use } from 'react';
import omit from 'lodash/omit';
import { Bar, XAxis, YAxis, Legend, Tooltip, BarChart, CartesianGrid, ResponsiveContainer } from 'recharts';

import useAppTheme from '@/hooks/useAppTheme';
import { Skeleton } from '@/components/ui/skeleton';
import { getUSDFormatter } from '@/lib/number.utils';
import { useClientOnly } from '@/hooks/useClientOnly';
import { Separator } from '@/components/ui/separator';
import DisplayCard from '@/shared/components/DisplayCard';
import Typography from '@/components/typography/Typography';
import { SubscriptionOriginal } from '@/models/bills/bills.model';
import SubscriptionLogoAvatar from '@/components/logos/SubscriptionLogoAvatar';
import { CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';
import { CHART_COLORS, AllBillsChartNode, NON_CHART_DATA_KEYS, DashboardYearBillsChartData } from '@/models/charts/chart.model';

const usdFormatter = getUSDFormatter();

interface Props {
  chartDataPromise: Promise<DashboardYearBillsChartData>;
}

export default function YearDueChart({ chartDataPromise }: Props) {
  const isClient = useClientOnly();
  const { isDarkMode } = useAppTheme();

  if (!isClient) {
    return (
      <div>
        <Skeleton className="h-148 w-full" />
      </div>
    );
  }

  const chartData: DashboardYearBillsChartData = use(chartDataPromise);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

  const data = chartData.chartData.map((node: AllBillsChartNode) => {
    const chartDataNode = omit(node, NON_CHART_DATA_KEYS);
    const isCurrentMonth = node.year === currentYear && node.month === currentMonth;
    return {
      ...chartDataNode,
      dateDisplayId: isCurrentMonth ? 'Current' : node.displayName,
      year: node.year,
      month: node.month,
    };
  });

  return (
    <div className="h-148 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={ data }
          margin={ {
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          } }
        >
          <CartesianGrid strokeDasharray="4 4" vertical={ false } />
          <XAxis
            dataKey="dateDisplayId"
            height={ 80 }
            interval={ 0 }
            tick={ <CustomXAxisTick isDarkMode={ isDarkMode } /> }
            label={ {
              value: 'Date',
              position: 'insideBottom',
              offset: -5,
              style: { fontSize: 20, fill: isDarkMode ? '#d1d5db' : '#374151', textAnchor: 'middle' },
            } }
          />
          <YAxis
            scale="sqrt"
            tickFormatter={ (value) => `$${value.toLocaleString('en-US')}` }
            tick={ { style: { fontVariantNumeric: 'tabular-nums', fill: isDarkMode ? '#d1d5db' : '#374151' } } }
            label={ {
              value: 'Cost',
              angle: -90,
              position: 'insideLeft',
              offset: -10,
              style: { fontSize: 20, fill: isDarkMode ? '#d1d5db' : '#374151', textAnchor: 'middle' },
            } }
          />
          <Tooltip
            content={ <CustomTooltip subscriptions={ chartData.subscriptions } /> }
            cursor={ { fill: 'rgba(0, 0, 0, 0.05)' } }
            animationDuration={ 0 }
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={ {
              right: 0,
            } }
            content={ <CustomLegend subscriptions={ chartData.subscriptions } /> }
          />
          { [...chartData.subscriptions]
            .toSorted((a: SubscriptionOriginal, b: SubscriptionOriginal) => {
              return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
            })
            .map((subscription: SubscriptionOriginal) => (
              <Bar
                key={ subscription.id }
                dataKey={ `${subscription.name}.totalCost` }
                stackId="a"
                fill={ CHART_COLORS[subscription.name.trim()] || '#94a3b8' }
                name={ subscription.name }
              />
            )) }
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomXAxisTick({ x, y, payload, isDarkMode }: CustomTickProps) {
  const monthValue = payload?.value.split('/')[0];
  const yearValue = payload?.value.split('/')[1];
  const isFirstMonth: boolean = monthValue === '1';

  const isBoldedText = payload?.value === 'Current' || isFirstMonth;

  // Dark mode: gray-300 (#d1d5db) for bold, gray-400 (#9ca3af) for normal
  // Light mode: gray-700 (#374151) for bold, gray-500 (#6b7280) for normal
  const fillColor =
    isDarkMode ?
      isBoldedText ? '#d1d5db'
      : '#9ca3af'
    : isBoldedText ? '#374151'
    : '#6b7280';

  return (
    <g transform={ `translate(${x},${y})` }>
      <text
        x={ 0 }
        y={ 0 }
        dy={ 16 }
        textAnchor="end"
        fill={ fillColor }
        fontSize={ isBoldedText ? 14 : 12 }
        fontWeight={ isBoldedText ? 700 : 400 }
        transform="rotate(-45)"
      >
        { isFirstMonth ? yearValue : payload?.value }
      </text>
    </g>
  );
}

function CustomLegend({ payload, subscriptions }: CustomLegendProps) {
  if (!payload || payload.length === 0) {
    return null;
  }

  // Sort legend items alphabetically by value (subscription name)
  const sortedPayload = [...payload].sort((a, b) => {
    const nameA = a.value?.toLowerCase() || '';
    const nameB = b.value?.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="flex flex-col gap-2 pl-4">
      { sortedPayload.map((item, index) => {
        const subscription = subscriptions?.find((sub) => sub.name.trim() === item.value.trim());
        return (
          <div key={ index } className="flex items-center gap-2">
            <Typography variant="body0" className="min-w-3 tabular-nums">{ index + 1 }</Typography>
            <div className="h-3 w-3 rounded-sm" style={ { backgroundColor: item.color } } />
            { subscription ?
              <SubscriptionLogoAvatar subscription={ subscription } avatarProps={ { className: 'size-5' } } />
            : null }
            <Typography variant="body1">{ item.value }</Typography>
          </div>
        );
      }) }
    </div>
  );
}

function CustomTooltip({ active, payload, label, subscriptions }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const total = payload.reduce((sum, item) => sum + item.value, 0);

  // Sort payload alphabetically by name
  const sortedPayload = [...payload].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <DisplayCard className="">
      <CardHeader>
        <CardTitle>
          <Typography variant="h4">{ label }</Typography>
        </CardTitle>
        <CardDescription>
          <Typography variant="h5" className="tabular-nums">
            Total: { usdFormatter.format(total) }
          </Typography>
        </CardDescription>
      </CardHeader>
      <Separator orientation="horizontal" className="w-full" />
      <CardContent>
        <div className="space-y-1">
          { sortedPayload.map((item, index) => {
            const subscription = subscriptions?.find((sub) => sub.name.trim() === item.name.trim());
            return (
              <div key={ index } className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={ { backgroundColor: item.color } } />
                  { subscription ?
                    <SubscriptionLogoAvatar subscription={ subscription } avatarProps={ { className: 'size-4' } } />
                  : null }
                  <Typography variant="body1">{ item.name }</Typography>
                </div>
                <Typography variant="body1" className="tabular-nums">
                  { usdFormatter.format(item.value) }
                </Typography>
              </div>
            );
          }) }
        </div>
      </CardContent>
    </DisplayCard>
  );
}

interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
  isDarkMode?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
  subscriptions?: SubscriptionOriginal[];
}

interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
    type?: string;
  }>;
  subscriptions?: SubscriptionOriginal[];
}
