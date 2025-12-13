import { Separator } from '@/components/ui/separator';
import BillStatusExplain from '@/components/bills/BillStatusExplain';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

import SubscriptionDetailsMetadataFooterTotalBills from './SubscriptionDetailsMetadataFooterTotalBills';
import SubscriptionDetailsMetadataFooterCurrentYearBills from './SubscriptionDetailsMetadataFooterCurrentYearBills';

export default function SubscriptionDetailsMetadataFooter({ subscription }: { subscription: SubscriptionWithBillDues }) {
  return (
    <div className="flex w-full flex-row items-start justify-between gap-x-2">
      <div className="flex flex-col items-start justify-start gap-y-2">
        <SubscriptionDetailsMetadataFooterCurrentYearBills subscription={ subscription } />
        <Separator orientation="horizontal" className="w-full" />
        <BillStatusExplain />
      </div>

      <SubscriptionDetailsMetadataFooterTotalBills subscription={ subscription } />
    </div>
  );
}
