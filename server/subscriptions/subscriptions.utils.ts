import { DateTime } from 'luxon';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

export function getSortedSubscriptions(subscriptions: SubscriptionWithBillDues[], sortData: SortDataModel): SubscriptionWithBillDues[] {
  const result: SubscriptionWithBillDues[] = subscriptions.toSorted((a: SubscriptionWithBillDues, b: SubscriptionWithBillDues) => {
    if (sortData?.sortField) {
      if (sortData.sortField === 'dateAdded') {
        if (sortData.sortDirection === 'asc') {
          return a.dateAdded.getTime() > b.dateAdded.getTime() ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return a.dateAdded.getTime() < b.dateAdded.getTime() ? 1 : -1;
        }
      }
      if (sortData.sortField === 'updatedAt') {
        if (sortData.sortDirection === 'asc') {
          return (a.updatedAt ? a.updatedAt.getTime() : 0) > (b.updatedAt ? b.updatedAt.getTime() : 0) ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return (a.updatedAt ? a.updatedAt.getTime() : 0) < (b.updatedAt ? b.updatedAt.getTime() : 0) ? 1 : -1;
        }
      }
      if (sortData.sortField === 'name') {
        if (sortData.sortDirection === 'asc') {
          return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
        }
      }

      if (sortData.sortField === 'cost') {
        const aCost = a.cost;
        const bCost = b.cost;
        if (sortData.sortDirection === 'asc') {
          return aCost > bCost ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return aCost < bCost ? 1 : -1;
        }
      }

      if (sortData.sortField === 'description') {
        const aDescription = a.description ?? '';
        const bDescription = b.description ?? '';
        if (sortData.sortDirection === 'asc') {
          return aDescription > bDescription ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return aDescription < bDescription ? 1 : -1;
        }
      }

      if (sortData.sortField === 'url') {
        const aUrl = a.url ?? '';
        const bUrl = b.url ?? '';
        if (sortData.sortDirection === 'asc') {
          return aUrl > bUrl ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return aUrl < bUrl ? 1 : -1;
        }
      }

      if (sortData.sortField === 'approved') {
        if (sortData.sortDirection === 'asc') {
          return a.approved > b.approved ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return a.approved < b.approved ? 1 : -1;
        }
      }

      if (sortData.sortField === 'signed') {
        if (sortData.sortDirection === 'asc') {
          return a.signed > b.signed ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return a.signed < b.signed ? 1 : -1;
        }
      }

      if (sortData.sortField === 'billCycleDuration') {
        if (sortData.sortDirection === 'asc') {
          return a.billCycleDuration.toLowerCase() > b.billCycleDuration.toLowerCase() ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return a.billCycleDuration.toLowerCase() < b.billCycleDuration.toLowerCase() ? 1 : -1;
        }
      }

      if (sortData.sortField === 'billDuesCurrentYearCount') {
        let billsWithInTimeRangeA: BillDueWithSubscription[] = [];

        if (a.billCycleDuration === 'yearly' || a.billCycleDuration === 'monthly') {
          const currentYearStartLuxon = DateTime.now().setZone(EST_TIME_ZONE).startOf('year');
          const currentYearEndLuxon = currentYearStartLuxon.endOf('year');
          const startDateEpoch = currentYearStartLuxon.toMillis();
          const endDateEpoch = currentYearEndLuxon.toMillis();

          billsWithInTimeRangeA = a.billDues.filter((billDue: BillDueWithSubscription) => {
            const billDueDateLuxon = DateTime.fromMillis(Number.parseInt(billDue.dueDate as unknown as string)).setZone(EST_TIME_ZONE);
            return billDueDateLuxon.toMillis() >= startDateEpoch && billDueDateLuxon.toMillis() <= endDateEpoch;
          });
        } else if (a.billCycleDuration === 'once') {
          billsWithInTimeRangeA = a.billDues;
        }

        const reimbursedBillsCountA = billsWithInTimeRangeA.filter((billDue: BillDueWithSubscription) => billDue.reimbursed).length;
        const countA = reimbursedBillsCountA;

        let billsWithInTimeRangeB: BillDueWithSubscription[] = [];

        if (b.billCycleDuration === 'yearly' || b.billCycleDuration === 'monthly') {
          const currentYearStartLuxon = DateTime.now().setZone(EST_TIME_ZONE).startOf('year');
          const currentYearEndLuxon = currentYearStartLuxon.endOf('year');
          const startDateEpoch = currentYearStartLuxon.toMillis();
          const endDateEpoch = currentYearEndLuxon.toMillis();

          billsWithInTimeRangeB = b.billDues.filter((billDue: BillDueWithSubscription) => {
            const billDueDateLuxon = DateTime.fromMillis(Number.parseInt(billDue.dueDate as unknown as string)).setZone(EST_TIME_ZONE);
            return billDueDateLuxon.toMillis() >= startDateEpoch && billDueDateLuxon.toMillis() <= endDateEpoch;
          });
        } else if (b.billCycleDuration === 'once') {
          billsWithInTimeRangeB = b.billDues;
        }

        const reimbursedBillsCountB = billsWithInTimeRangeB.filter((billDue: BillDueWithSubscription) => billDue.reimbursed).length;
        const countB = reimbursedBillsCountB;

        if (sortData.sortDirection === 'asc') {
          return countA > countB ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return countA < countB ? 1 : -1;
        } else {
          return 0;
        }
      }

      if (sortData.sortField === 'billDuesCurrentYearTotalCost') {
        const aBillDuesCurrentYearTotalCost = a.billDuesCurrentYearTotalCost ?? 0;
        const bBillDuesCurrentYearTotalCost = b.billDuesCurrentYearTotalCost ?? 0;

        if (sortData.sortDirection === 'asc') {
          return aBillDuesCurrentYearTotalCost > bBillDuesCurrentYearTotalCost ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return aBillDuesCurrentYearTotalCost < bBillDuesCurrentYearTotalCost ? 1 : -1;
        }
      }

      return a[sortData.sortField] > b[sortData.sortField] ? 1 : -1;
    }

    return 0;
  });

  return result;
}
