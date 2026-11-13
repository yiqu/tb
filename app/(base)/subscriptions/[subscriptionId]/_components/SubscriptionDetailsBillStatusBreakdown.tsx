import { Clock, CircleAlert, CircleCheck, HandCoins } from 'lucide-react';
import { ReactNode } from 'react';

import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import { SubscriptionDetailsStatsStatusBreakdown } from '@/models/subscriptions/subscription-details-stats.model';

import SubscriptionDetailsChartCard from './SubscriptionDetailsChartCard';

interface StatusSegment {
  id: keyof SubscriptionDetailsStatsStatusBreakdown;
  label: string;
  description: string;
  color: string;
  icon: ReactNode;
}

const STATUS_SEGMENTS: StatusSegment[] = [
  {
    id: 'completed',
    label: 'Completed',
    description: 'Paid and reimbursed',
    color: 'var(--green-1)',
    icon: <CircleCheck className="size-4 text-green-500" />,
  },
  {
    id: 'paidNotReimbursed',
    label: 'Awaiting reimbursement',
    description: 'Paid, not reimbursed yet',
    color: 'var(--yellow-1)',
    icon: <HandCoins className="size-4 text-yellow-500" />,
  },
  {
    id: 'notPaid',
    label: 'Not paid',
    description: 'Due already, not paid',
    color: 'var(--destructive)',
    icon: <CircleAlert className="size-4 text-red-500" />,
  },
  {
    id: 'upcoming',
    label: 'Upcoming',
    description: 'Due after today, not paid',
    color: 'var(--muted-foreground)',
    icon: <Clock className="size-4 text-muted-foreground" />,
  },
];

/** A share that is not zero never reads as 0%, and one that is not everything never reads as 100%. */
function formatShare(count: number, totalCount: number): string {
  if (count === 0) {
    return '0%';
  }
  const percent: number = (count / totalCount) * 100;
  if (percent < 1) {
    return '<1%';
  }
  if (count < totalCount && percent > 99) {
    return '>99%';
  }
  return `${Math.round(percent)}%`;
}

interface Props {
  statusBreakdown: SubscriptionDetailsStatsStatusBreakdown;
  totalCount: number;
}

export default function SubscriptionDetailsBillStatusBreakdown({ statusBreakdown, totalCount }: Props) {
  return (
    <SubscriptionDetailsChartCard title="Bill status" description={ totalCount === 1 ? 'Where the bill stands.' : `Where all ${totalCount} bills stand.` }>
      <ColumnStack className="grow justify-center gap-y-4">
        <div className="flex h-3 w-full flex-row gap-x-0.5 overflow-hidden rounded-full">
          { STATUS_SEGMENTS.filter((segment) => statusBreakdown[segment.id] > 0).map((segment) => (
            <div
              key={ segment.id }
              title={ `${segment.label}: ${statusBreakdown[segment.id]}` }
              className="h-full min-w-1"
              style={ { backgroundColor: segment.color, flexGrow: statusBreakdown[segment.id], flexBasis: 0 } }
            />
          )) }
        </div>
        <ColumnStack className="gap-y-2.5">
          { STATUS_SEGMENTS.map((segment) => (
            <div key={ segment.id } className="flex flex-row items-center justify-between gap-x-3">
              <div className="flex min-w-0 flex-row items-center gap-x-2">
                <span className="shrink-0">{ segment.icon }</span>
                <ColumnStack className="min-w-0">
                  <Typography variant="body1" className="truncate font-semibold">
                    { segment.label }
                  </Typography>
                  <Typography variant="caption1" className="truncate">
                    { segment.description }
                  </Typography>
                </ColumnStack>
              </div>
              <div className="flex shrink-0 flex-row items-baseline gap-x-1.5">
                <Typography variant="h5" as="span" className="tabular-nums">
                  { statusBreakdown[segment.id] }
                </Typography>
                <Typography variant="caption1" className="w-9 text-right tabular-nums">
                  { formatShare(statusBreakdown[segment.id], totalCount) }
                </Typography>
              </div>
            </div>
          )) }
        </ColumnStack>
      </ColumnStack>
    </SubscriptionDetailsChartCard>
  );
}
