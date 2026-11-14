import { CardContent } from '@/components/ui/card';
import ColumnStack from '@/shared/components/ColumnStack';
import DisplayCard from '@/shared/components/DisplayCard';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { SubscriptionDetailsStatsBill } from '@/models/subscriptions/subscription-details-stats.model';

import SubscriptionDetailsStats from './SubscriptionDetailsStats';
import SubscriptionDetailsMetadataData from './SubscriptionDetailsMetadataData';

export default function SubscriptionDetailsMetadata({ subscription }: { subscription: SubscriptionWithBillDues }) {
  // only the fields the stats need, so the client component is not sent every bill with its nested subscription
  const bills: SubscriptionDetailsStatsBill[] = subscription.billDues.map((billDue: BillDueWithSubscription) => ({
    dueDate: Number.parseInt(billDue.dueDate),
    cost: billDue.cost ?? subscription.cost ?? 0,
    paid: billDue.paid,
    reimbursed: billDue.reimbursed,
  }));

  return (
    <ColumnStack className="@container w-full gap-y-3">
      <DisplayCard className="w-full py-4">
        <CardContent className="px-4">
          <SubscriptionDetailsMetadataData subscription={ subscription } />
        </CardContent>
      </DisplayCard>
      <SubscriptionDetailsStats bills={ bills } />
    </ColumnStack>
  );
}
