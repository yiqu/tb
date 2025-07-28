import { DateTime } from 'luxon';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import Typography from '@/components/typography/Typography';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

import SubscriptionDetailsMetadataFooterTotalBillsChart from './SubscriptionDetailsMetadataFooterTotalBillsChart';

export default function SubscriptionDetailsMetadataFooterCurrentYearBills({ subscription }: { subscription: SubscriptionWithBillDues }) {
  let billsWithInTimeRange: BillDueWithSubscription[] = [];
  const currentYearInNumber: number = DateTime.now().setZone(EST_TIME_ZONE).year;

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
  const paidOrReimbursedBillsCount = billsWithInTimeRange.filter(
    (billDue: BillDueWithSubscription) => billDue.paid || billDue.reimbursed,
  ).length;

  const count1 = paidOrReimbursedBillsCount;
  const count2 = billsWithinTimeRangeCount - paidOrReimbursedBillsCount;

  return (
    <div className="flex flex-row items-center justify-end gap-x-2">
      <Typography variant="body1">
        Current year <strong>{ currentYearInNumber }</strong> bills:{ ' ' }
        <strong>
          { paidOrReimbursedBillsCount } / { billsWithinTimeRangeCount }
        </strong>
      </Typography>
      <SubscriptionDetailsMetadataFooterTotalBillsChart count1={ count1 } count2={ count2 } />
    </div>
  );
}
