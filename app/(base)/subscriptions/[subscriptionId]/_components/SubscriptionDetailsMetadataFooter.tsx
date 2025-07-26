import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

import SubscriptionDetailsMetadataFooterTotalBills from './SubscriptionDetailsMetadataFooterTotalBills';
import SubscriptionDetailsMetadataFooterCurrentYearBills from './SubscriptionDetailsMetadataFooterCurrentYearBills';

export default function SubscriptionDetailsMetadataFooter({ subscription }: { subscription: SubscriptionWithBillDues }) {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-x-2">
      <SubscriptionDetailsMetadataFooterCurrentYearBills subscription={ subscription } />
      <SubscriptionDetailsMetadataFooterTotalBills subscription={ subscription } />
    </div>
  );
}
