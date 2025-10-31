import { DateTime } from 'luxon';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { SubscriptionFrequency, SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

export function transformSubscriptionExtraProps(subscriptions: SubscriptionWithBillDues[], startDateEpoch: number, endDateEpoch: number) {
  const subscriptionsToReturnWithDateInEST: SubscriptionWithBillDues[] = subscriptions.map((subscription: SubscriptionWithBillDues) => {
    const dateAddedInEstDate: Date = DateTime.fromJSDate(new Date(`${subscription.dateAdded}`))
      .setZone(EST_TIME_ZONE)
      .toJSDate();
    const dateAddedInEst: string = DateTime.fromJSDate(new Date(`${subscription.dateAdded}`))
      .setZone(EST_TIME_ZONE)
      .toFormat('MM/dd/yyyy');
    const dateAddedRelativeDate = formatDistanceToNow(dateAddedInEstDate, { addSuffix: true });

    const updatedAtInEstDate: Date = DateTime.fromJSDate(new Date(`${subscription.updatedAt}`))
      .setZone(EST_TIME_ZONE)
      .toJSDate();
    const updatedAtInEst: string = DateTime.fromJSDate(new Date(`${subscription.updatedAt}`))
      .setZone(EST_TIME_ZONE)
      .toFormat('MM/dd/yyyy');
    const updatedAtRelativeDate = formatDistanceToNow(updatedAtInEstDate, { addSuffix: true });

    // calculate bills for current year
    let billsWithInTimeRange: BillDueWithSubscription[] = [];

    billsWithInTimeRange = subscription.billDues.filter((billDue: BillDueWithSubscription) => {
      const billDueDateLuxon: number = +billDue.dueDate;
      return billDueDateLuxon >= startDateEpoch && billDueDateLuxon <= endDateEpoch;
    });

    const billDuesCurrentYearTotalCost = billsWithInTimeRange.reduce((acc, billDue) => {
      return acc + Number.parseFloat(`${billDue.cost ?? subscription.cost ?? 0}`);
    }, 0);

    const billsWithinTimeRangeCount = billsWithInTimeRange.length;
    const reimbursedBillsCount = billsWithInTimeRange.filter((billDue: BillDueWithSubscription) => billDue.reimbursed).length;

    // All time bills
    const totalBillsAllTimeCount = subscription.billDues.length;
    const totalBillsAllTimeTotalCost = subscription.billDues.reduce((acc, billDue) => {
      return acc + Number.parseFloat(`${billDue.cost ?? subscription.cost ?? 0}`);
    }, 0);

    return {
      ...subscription,
      dateAddedInEst: dateAddedInEst,
      dateAddedInEstRelative: dateAddedRelativeDate,
      updatedAtInEst: updatedAtInEst,
      updatedAtInEstRelative: updatedAtRelativeDate,
      reimbursedBillsCount: reimbursedBillsCount,
      billsWithinTimeRangeCount: billsWithinTimeRangeCount,
      totalBillsAllTimeCount: totalBillsAllTimeCount,
      totalBillsAllTimeTotalCost: totalBillsAllTimeTotalCost,
      selectedYearInEpoch: {
        startDateEpoch: startDateEpoch,
        endDateEpoch: endDateEpoch,
      },
      billDuesCurrentYearTotalCost: billDuesCurrentYearTotalCost,
    };
  });

  return subscriptionsToReturnWithDateInEST;
}

export function transformSubscriptionExtraPropsForFavorite(subscriptions: SubscriptionWithBillDues[]): SubscriptionWithBillDues[] {
  const result = subscriptions.map((subscription: SubscriptionWithBillDues) => {
    const currentDateLuxon = DateTime.now().setZone(EST_TIME_ZONE);
    const frequency: SubscriptionFrequency = subscription.billCycleDuration;
    let startDateEpoch: number = 0;
    let endDateEpoch: number = 0;

    let billDuesWithinTimeRange: BillDueWithSubscription[] = [];
    let nextDueDateForThisCycle: number | null = null;
    let nextDueDateForThisCycleBillDue: BillDueWithSubscription | null = null;
    let outstandingBillDuesFOrThisCycleAndPast: BillDueWithSubscription[] = [];

    if (frequency === 'yearly') {
      const currentYearStartLuxon = currentDateLuxon.startOf('year');
      const currentYearEndLuxon = currentDateLuxon.endOf('year');
      startDateEpoch = currentYearStartLuxon.toMillis();
      endDateEpoch = currentYearEndLuxon.toMillis();

      billDuesWithinTimeRange = subscription.billDues.filter((billDue: BillDueWithSubscription) => {
        const dueDateMillis = Number.parseInt(billDue.dueDate);
        return dueDateMillis >= startDateEpoch && dueDateMillis <= endDateEpoch;
      });

      if (billDuesWithinTimeRange.length > 0) {
        nextDueDateForThisCycle = Number.parseInt(billDuesWithinTimeRange[0].dueDate);
        nextDueDateForThisCycleBillDue = billDuesWithinTimeRange[0];
      }
    } else if (frequency === 'monthly') {
      const currentMonthStartLuxon = currentDateLuxon.startOf('month');
      const currentMonthEndLuxon = currentDateLuxon.endOf('month');
      startDateEpoch = currentMonthStartLuxon.toMillis();
      endDateEpoch = currentMonthEndLuxon.toMillis();

      billDuesWithinTimeRange = subscription.billDues.filter((billDue: BillDueWithSubscription) => {
        const dueDateMillis = Number.parseInt(billDue.dueDate);
        return dueDateMillis >= startDateEpoch && dueDateMillis <= endDateEpoch;
      });

      outstandingBillDuesFOrThisCycleAndPast = billDuesWithinTimeRange.filter((billDue: BillDueWithSubscription) => {
        const dueDateMillis = Number.parseInt(billDue.dueDate);
        // not paid, or not reimbursed and between 0 and start date epoch
        return (!billDue.paid || !billDue.reimbursed) && dueDateMillis >= 0 && dueDateMillis <= endDateEpoch;
      });
      if (billDuesWithinTimeRange.length > 0) {
        nextDueDateForThisCycle = Number.parseInt(billDuesWithinTimeRange[0].dueDate);
        nextDueDateForThisCycleBillDue = billDuesWithinTimeRange[0];
      }
    } else if (frequency === 'once') {
      billDuesWithinTimeRange = subscription.billDues;
      if (billDuesWithinTimeRange.length > 0) {
        nextDueDateForThisCycle = Number.parseInt(billDuesWithinTimeRange[0].dueDate);
        nextDueDateForThisCycleBillDue = billDuesWithinTimeRange[0];
      }
    }

    const dueCostThisCycle: number = billDuesWithinTimeRange.reduce((acc, billDue) => {
      return acc + Number.parseFloat(`${billDue.cost ?? subscription.cost ?? 0}`);
    }, 0);

    const billDuesWithinTimeRangeThatIsNotPaidOrReimbursed: BillDueWithSubscription[] = billDuesWithinTimeRange.filter(
      (billDue: BillDueWithSubscription) => {
        return !billDue.paid || !billDue.reimbursed;
      },
    );

    return {
      ...subscription,
      billDuesWithinTimeRange: billDuesWithinTimeRange,
      dueCostThisCycle: billDuesWithinTimeRange.length > 0 ? dueCostThisCycle : null,
      dueDateThisCycle: nextDueDateForThisCycle,
      nextDueDateForThisCycleBillDue: nextDueDateForThisCycleBillDue,
      billDuesWithinTimeRangeThatIsNotPaidOrReimbursed: billDuesWithinTimeRangeThatIsNotPaidOrReimbursed,
      outstandingBillDuesFOrThisCycleAndPast: outstandingBillDuesFOrThisCycleAndPast,
    };
  });

  return result;
}
