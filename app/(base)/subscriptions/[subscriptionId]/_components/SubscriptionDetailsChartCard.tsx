import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { CardContent } from '@/components/ui/card';
import DisplayCard from '@/shared/components/DisplayCard';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';

export const CHART_COLOR_SPENT = 'var(--primary)';
export const CHART_COLOR_UPCOMING = 'color-mix(in oklch, var(--primary) 35%, var(--card))';
export const CHART_AXIS_TICK_STYLE = { fontSize: 12, fill: 'var(--muted-foreground)', fontVariantNumeric: 'tabular-nums' } as const;

interface SubscriptionDetailsChartCardProps {
  title: string;
  description: string;
  legend?: ReactNode;
  className?: string;
  children: ReactNode;
}

export default function SubscriptionDetailsChartCard({ title, description, legend, className, children }: SubscriptionDetailsChartCardProps) {
  return (
    <DisplayCard className={ cn('py-4', className) }>
      <CardContent className="h-full px-4">
        <ColumnStack className="h-full gap-y-3">
          <div className="flex flex-row flex-wrap items-start justify-between gap-x-4 gap-y-1">
            <ColumnStack>
              <Typography variant="h6">{ title }</Typography>
              <Typography variant="caption1">{ description }</Typography>
            </ColumnStack>
            { legend }
          </div>
          { children }
        </ColumnStack>
      </CardContent>
    </DisplayCard>
  );
}

export function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1">
      { items.map((item) => (
        <div key={ item.label } className="flex flex-row items-center gap-x-1.5">
          <span className="size-2.5 shrink-0 rounded-xs" style={ { backgroundColor: item.color } } />
          <Typography variant="caption1">{ item.label }</Typography>
        </div>
      )) }
    </div>
  );
}

export function ChartTooltipCard({ title, rows }: { title: string; rows: { label: string; value: string; color?: string }[] }) {
  return (
    <div className="min-w-40 rounded-md border bg-popover px-3 py-2 text-popover-foreground shadow-md">
      <Typography variant="label1" className="font-semibold">
        { title }
      </Typography>
      <ColumnStack className="mt-1 gap-y-0.5">
        { rows.map((row) => (
          <div key={ row.label } className="flex flex-row items-center justify-between gap-x-4">
            <div className="flex flex-row items-center gap-x-1.5">
              { row.color ?
                <span className="size-2.5 shrink-0 rounded-xs" style={ { backgroundColor: row.color } } />
              : null }
              <Typography variant="body0">{ row.label }</Typography>
            </div>
            <Typography variant="body0" className="font-semibold tabular-nums">
              { row.value }
            </Typography>
          </div>
        )) }
      </ColumnStack>
    </div>
  );
}
