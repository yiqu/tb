import Typography from '@/components/typography/Typography';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import SubscriptionDetailsMetadataFooterTotalBillsChart from '@/app/(base)/subscriptions/[subscriptionId]/_components/SubscriptionDetailsMetadataFooterTotalBillsChart';

export default function SubscriptionsTableCellDisplayCurrentYearCount({ subscription }: { subscription: SubscriptionWithBillDues }) {
  const billsWithinTimeRangeCount = subscription.billsWithinTimeRangeCount ?? 0;
  const reimbursedBillsCount = subscription.reimbursedBillsCount ?? 0;

  const count1 = reimbursedBillsCount;
  const count2 = billsWithinTimeRangeCount - reimbursedBillsCount;

  return (
    <div className="flex flex-row items-center justify-start gap-x-1">
      <Typography variant="body1">
        { reimbursedBillsCount } / { billsWithinTimeRangeCount }
      </Typography>
      <SubscriptionDetailsMetadataFooterTotalBillsChart count1={ count1 } count2={ count2 } progressColor="var(--green-1)" />
    </div>
  );
}
