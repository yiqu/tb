import { DateTime } from 'luxon';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import Typography from '@/components/typography/Typography';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import SubscriptionDetailsMetadataFooterTotalBillsChart from '@/app/(base)/subscriptions/[subscriptionId]/_components/SubscriptionDetailsMetadataFooterTotalBillsChart';

export default function SubscriptionsTableCellDisplayCurrentYearCount({ subscription }: { subscription: SubscriptionWithBillDues }) {
  let billsWithInTimeRange: BillDueWithSubscription[] = [];

  if (subscription.billCycleDuration === 'yearly' || subscription.billCycleDuration === 'monthly') {
    const currentYearStartLuxon = DateTime.now().setZone(EST_TIME_ZONE).startOf('year');
    const currentYearEndLuxon = currentYearStartLuxon.endOf('year');
    const startDateEpoch = currentYearStartLuxon.toMillis();
    const endDateEpoch = currentYearEndLuxon.toMillis();

    billsWithInTimeRange = subscription.billDues.filter((billDue: BillDueWithSubscription) => {
      const billDueDateLuxon = DateTime.fromMillis(Number.parseInt(billDue.dueDate as unknown as string)).setZone(EST_TIME_ZONE);
      return billDueDateLuxon.toMillis() >= startDateEpoch && billDueDateLuxon.toMillis() <= endDateEpoch;
    });
  } else if (subscription.billCycleDuration === 'once') {
    billsWithInTimeRange = subscription.billDues;
  }

  const billsWithinTimeRangeCount = billsWithInTimeRange.length;
  const reimbursedBillsCount = billsWithInTimeRange.filter((billDue: BillDueWithSubscription) => billDue.reimbursed).length;

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
