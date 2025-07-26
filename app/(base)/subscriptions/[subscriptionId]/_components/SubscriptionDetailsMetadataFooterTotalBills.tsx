import Typography from '@/components/typography/Typography';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

import SubscriptionDetailsMetadataFooterTotalBillsChart from './SubscriptionDetailsMetadataFooterTotalBillsChart';

export default function SubscriptionDetailsMetadataFooterTotalBills({ subscription }: { subscription: SubscriptionWithBillDues }) {
  const totalBillsCount: number = subscription.billDues.length;
  const billsPaidOrReimbursedCount: number = subscription.billDues.filter((billDue) => billDue.paid || billDue.reimbursed).length;
  const count1 = billsPaidOrReimbursedCount;
  const count2 = totalBillsCount - billsPaidOrReimbursedCount;

  return (
    <div className="flex flex-row items-center justify-end gap-x-2">
      <Typography>
        Paid or reimbursed vs Total:{ ' ' }
        <strong>
          { billsPaidOrReimbursedCount } / { totalBillsCount }
        </strong>
      </Typography>
      <SubscriptionDetailsMetadataFooterTotalBillsChart count1={ count1 } count2={ count2 } />
    </div>
  );
}
