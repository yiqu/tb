import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

import SubscriptionDetailsMetadataFooterTotalBills from './SubscriptionDetailsMetadataFooterTotalBills';
import SubscriptionDetailsMetadataFooterCurrentYearBills from './SubscriptionDetailsMetadataFooterCurrentYearBills';

export default function SubscriptionDetailsMetadataFooter({ subscription }: { subscription: SubscriptionWithBillDues }) {
  return (
    <div className="flex w-full flex-row items-start justify-between gap-x-2">
      <Suspense fallback={ <CurrentYearBillsLoading /> }>
        <SubscriptionDetailsMetadataFooterCurrentYearBills subscription={ subscription } />
      </Suspense>
      <SubscriptionDetailsMetadataFooterTotalBills subscription={ subscription } />
    </div>
  );
}

function CurrentYearBillsLoading() {
  return <Skeleton className="h-[50px] w-[311px]" />;
}
