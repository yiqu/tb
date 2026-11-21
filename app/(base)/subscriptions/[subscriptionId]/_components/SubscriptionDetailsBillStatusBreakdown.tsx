import { Clock, CircleAlert, CircleCheck, HandCoins } from 'lucide-react';
import { ReactNode } from 'react';

import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import { SubscriptionDetailsStatsStatusBreakdown } from '@/models/subscriptions/subscription-details-stats.model';

import SubscriptionDetailsBillStatusBar from './SubscriptionDetailsBillStatusBar';
import SubscriptionDetailsChartCard from './SubscriptionDetailsChartCard';
import SubscriptionDetailsBillStatusInfoHoverCard from './SubscriptionDetailsBillStatusInfoHoverCard';
import { formatStatsDate } from './subscription-details-stats.utils';

interface StatusSegment {
  id: keyof SubscriptionDetailsStatsStatusBreakdown;
  label: string;
  description: string;
  color: string;
  icon: ReactNode;
  /** What the info hover card says. Gets the end of today and the start of tomorrow (both EST) as text */
  getRules: (_endOfToday: string, _startOfTomorrow: string) => string[];
}

const ALL_BILLS_RULE = 'Counts every bill of this subscription, all time: past and future due dates.';
const ONE_STATUS_RULE = 'Every bill is in exactly one status. Checked in this order: Completed, Awaiting reimbursement, then Not paid or Upcoming by due date.';

const STATUS_SEGMENTS: StatusSegment[] = [
  {
    id: 'completed',
    label: 'Completed',
    description: 'Paid and reimbursed',
    color: 'var(--green-1)',
    icon: <CircleCheck className="size-4 text-(--green-1)" />,
    getRules: () => [
      'Paid is checked AND Reimbursed is checked.',
      'The due date does not matter. A future bill that is already paid and reimbursed counts here.',
      ALL_BILLS_RULE,
    ],
  },
  {
    id: 'paidNotReimbursed',
    label: 'Awaiting reimbursement',
    description: 'Paid, not reimbursed yet',
    color: 'var(--yellow-1)',
    icon: <HandCoins className="size-4 text-(--yellow-1)" />,
    getRules: () => [
      'Paid is checked, Reimbursed is not.',
      'The due date does not matter. A bill paid ahead of its due date counts here, not under Upcoming.',
      ALL_BILLS_RULE,
    ],
  },
  {
    id: 'notPaid',
    label: 'Not paid',
    description: 'Due already, not paid',
    color: 'var(--destructive)',
    icon: <CircleAlert className="size-4 text-destructive" />,
    getRules: (endOfToday) => [
      `Paid is not checked, and the due date is on or before the end of today: ${endOfToday}.`,
      'A bill due later today counts here, not under Upcoming.',
      'A bill marked reimbursed but not paid also counts here when it is due today or earlier. Due later, it is Upcoming.',
      ALL_BILLS_RULE,
      ONE_STATUS_RULE,
    ],
  },
  {
    id: 'upcoming',
    label: 'Upcoming',
    description: 'Due after today, not paid',
    color: 'var(--muted-foreground)',
    icon: <Clock className="size-4 text-muted-foreground" />,
    getRules: (endOfToday, startOfTomorrow) => [
      `Paid is not checked, and the due date is after the end of today (${endOfToday}), so from ${startOfTomorrow} on.`,
      'It is not "after right now": a bill due later today is Not paid.',
      'A bill paid early is under Completed or Awaiting reimbursement instead.',
      ONE_STATUS_RULE,
    ],
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
  /** Last millisecond of today in EST */
  endOfToday: number;
}

const RULE_DATE_FORMAT = "LLL d, yyyy, h:mm:ss a 'ET'";

export default function SubscriptionDetailsBillStatusBreakdown({ statusBreakdown, totalCount, endOfToday }: Props) {
  const endOfTodayText: string = formatStatsDate(endOfToday, RULE_DATE_FORMAT);
  const startOfTomorrowText: string = formatStatsDate(endOfToday + 1, RULE_DATE_FORMAT);

  return (
    <SubscriptionDetailsChartCard title="Bill status" description={ totalCount === 1 ? 'Where the bill stands.' : `Where all ${totalCount} bills stand.` }>
      <ColumnStack className="grow justify-center gap-y-4">
        <SubscriptionDetailsBillStatusBar
          segments={ STATUS_SEGMENTS }
          statusBreakdown={ statusBreakdown }
          totalCount={ totalCount }
          formatShare={ formatShare }
        />
        <ColumnStack className="gap-y-0.5">
          { STATUS_SEGMENTS.map((segment) => (
            <div key={ segment.id } className="flex flex-row items-center justify-between gap-x-3 rounded-md px-2 py-1.5 even:bg-table-row-stripe">
              <div className="flex min-w-0 flex-row items-center gap-x-2">
                <span className="shrink-0">{ segment.icon }</span>
                <ColumnStack className="min-w-0">
                  <div className="flex min-w-0 flex-row items-center gap-x-1.5">
                    <Typography variant="body1" className="truncate font-semibold">
                      { segment.label }
                    </Typography>
                    <SubscriptionDetailsBillStatusInfoHoverCard label={ segment.label } rules={ segment.getRules(endOfTodayText, startOfTomorrowText) } />
                  </div>
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
