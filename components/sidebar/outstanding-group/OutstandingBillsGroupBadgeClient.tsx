'use client';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useClientOnly } from '@/hooks/useClientOnly';
import { useGetOutstandingBillsAllTimeCount } from '@/store/bills/bills.store';

export default function OutstandingBillsGroupBadgeClient() {
  const isClient = useClientOnly();
  const outstandingBillsAllTimeCount: number | undefined = useGetOutstandingBillsAllTimeCount();
  if (!isClient) {
    return <BadgeLoading />;
  }

  if (outstandingBillsAllTimeCount === undefined) {
    return null;
  }

  if (outstandingBillsAllTimeCount === 0) {
    return null;
  }

  return (
    <Badge
      className={ `relative bottom-3 -ml-2 rounded-full font-semibold tabular-nums` }
      variant="secondary"
      title="Not paid or not reimbursed bills"
    >
      { outstandingBillsAllTimeCount }
    </Badge>
  );
}

function BadgeLoading() {
  return (
    <Badge className="relative bottom-3 -ml-2 rounded-full" variant="secondary">
      <Skeleton className="h-[21px] w-4 bg-transparent" />
    </Badge>
  );
}
