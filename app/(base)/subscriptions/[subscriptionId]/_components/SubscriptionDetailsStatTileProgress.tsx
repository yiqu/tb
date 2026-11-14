import { CircleCheck } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import { SubscriptionDetailsStatsPeriod } from '@/models/subscriptions/subscription-details-stats.model';

/** How many of a period's bills are completed (paid and reimbursed), as a count and a thin bar. */
export default function SubscriptionDetailsStatTileProgress({ period }: { period: SubscriptionDetailsStatsPeriod }) {
  if (period.count === 0) {
    return <Typography variant="caption1">No bills</Typography>;
  }

  const isAllCompleted: boolean = period.completedCount === period.count;

  return (
    <ColumnStack className="gap-y-1.5">
      <div className="flex flex-row items-center gap-x-1">
        { isAllCompleted ?
          <CircleCheck className="size-3.5 text-green-500" />
        : null }
        <Typography variant="caption1" className="tabular-nums">
          { period.completedCount } of { period.count } { period.count === 1 ? 'bill' : 'bills' } completed
        </Typography>
      </div>
      <Progress
        value={ (period.completedCount / period.count) * 100 }
        className="h-1.5"
        aria-label={ `${period.completedCount} of ${period.count} ${period.count === 1 ? 'bill' : 'bills'} completed` }
      />
    </ColumnStack>
  );
}
