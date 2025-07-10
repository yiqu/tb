import { DateTime } from 'luxon';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { BillDueWithSubscription } from '@/models/bills/bills.model';

export function getFilteredBillDuesByMonth(
  billDues: BillDueWithSubscription[],
  monthParams: string,
  yearParams: string,
): BillDueWithSubscription[] {
  const monthInt: number = Number.parseInt(monthParams);
  const yearInt: number = Number.parseInt(yearParams);

  // use Luxon to get the start and end of the month
  const startMonthLuxon = DateTime.fromObject(
    { year: yearInt, month: monthInt, day: 1 },
    {
      zone: EST_TIME_ZONE,
    },
  );
  const endMonthLuxon = startMonthLuxon.endOf('month');

  const startMonthEpoch: number = startMonthLuxon.toMillis();
  const endMonthEpoch: number = endMonthLuxon.toMillis();

  // filter by the bill due date, which is epoch time in string format
  const result: BillDueWithSubscription[] = billDues.filter((billDue: BillDueWithSubscription) => {
    const billDueDateEpoch: number = Number.parseInt(billDue.dueDate);
    return billDueDateEpoch >= startMonthEpoch && billDueDateEpoch <= endMonthEpoch;
  });

  return result;
}

export function getFilteredBillDuesByYear(billDues: BillDueWithSubscription[], yearParams: string): BillDueWithSubscription[] {
  const yearInt: number = Number.parseInt(yearParams);

  // use Luxon to get the start and end of the year
  const startYearLuxon = DateTime.fromObject(
    { year: yearInt, month: 1, day: 1 },
    {
      zone: EST_TIME_ZONE,
    },
  );
  const endYearLuxon = startYearLuxon.endOf('year');

  const startYearEpoch: number = startYearLuxon.toMillis();
  const endYearEpoch: number = endYearLuxon.toMillis();

  // filter by the bill due date, which is epoch time in string format
  const result: BillDueWithSubscription[] = billDues.filter((billDue: BillDueWithSubscription) => {
    const billDueDateEpoch: number = Number.parseInt(billDue.dueDate);
    return billDueDateEpoch >= startYearEpoch && billDueDateEpoch <= endYearEpoch;
  });

  return result;
}

export function getFilteredBillDuesBySpecialYear(billDues: BillDueWithSubscription[], yearParams: string): BillDueWithSubscription[] {
  const currentTimeLuxon = DateTime.now().setZone(EST_TIME_ZONE);
  const startOfTodayLuxon = currentTimeLuxon.startOf('day');
  const startOfTodayEpoch = startOfTodayLuxon.toMillis();

  const startOfCurrentYearLuxon = currentTimeLuxon.startOf('year');
  const startOfCurrentYearEpoch = startOfCurrentYearLuxon.toMillis();

  if (yearParams === 'future-include-today') {
    const result: BillDueWithSubscription[] = billDues.filter((billDue: BillDueWithSubscription) => {
      const billDueDateEpoch: number = Number.parseInt(billDue.dueDate);
      return billDueDateEpoch >= startOfTodayEpoch;
    });

    return result;
  } else if (yearParams === 'past-include-today') {
    const result: BillDueWithSubscription[] = billDues.filter((billDue: BillDueWithSubscription) => {
      const billDueDateEpoch: number = Number.parseInt(billDue.dueDate);
      return billDueDateEpoch <= startOfTodayEpoch;
    });

    return result;
  } else if (yearParams === 'future-include-current-year') {
    const result: BillDueWithSubscription[] = billDues.filter((billDue: BillDueWithSubscription) => {
      const billDueDateEpoch: number = Number.parseInt(billDue.dueDate);
      return billDueDateEpoch >= startOfCurrentYearEpoch;
    });

    return result;
  } else if (yearParams === 'past-include-current-year') {
    const result: BillDueWithSubscription[] = billDues.filter((billDue: BillDueWithSubscription) => {
      const billDueDateEpoch: number = Number.parseInt(billDue.dueDate);
      return billDueDateEpoch <= startOfCurrentYearEpoch;
    });

    return result;
  }

  return [];
}

export function getFilteredBillDuesBySpecialYearAndMonth(
  billDues: BillDueWithSubscription[],
  yearParams: string,
  monthParams: string,
): BillDueWithSubscription[] {
  // if its year string contains "future", find all bills that are in the future and within the selected month
  const currentTimeLuxon = DateTime.now().setZone(EST_TIME_ZONE);

  if (yearParams.includes('future')) {
    if (yearParams.includes('include-today')) {
      const startOfTodayLuxon = currentTimeLuxon.startOf('day');
      const startOfTodayEpoch = startOfTodayLuxon.toMillis();

      const result: BillDueWithSubscription[] = billDues.filter((billDue: BillDueWithSubscription) => {
        const monthInt = Number.parseInt(monthParams);
        // Keep any bill that is in the future and within the selected month
        const billDueDateLuxon = DateTime.fromMillis(Number.parseInt(billDue.dueDate)).setZone(EST_TIME_ZONE);
        const billDueDateEpoch = billDueDateLuxon.toMillis();
        return billDueDateEpoch >= startOfTodayEpoch && billDueDateLuxon.month === monthInt;
      });

      return result;
    }

    if (yearParams.includes('include-current-year')) {
      const startOfCurrentYearLuxon = currentTimeLuxon.startOf('year');
      const startOfCurrentYearEpoch = startOfCurrentYearLuxon.toMillis();

      const result: BillDueWithSubscription[] = billDues.filter((billDue: BillDueWithSubscription) => {
        const monthInt = Number.parseInt(monthParams);
        const billDueDateLuxon = DateTime.fromMillis(Number.parseInt(billDue.dueDate)).setZone(EST_TIME_ZONE);
        const billDueDateEpoch = billDueDateLuxon.toMillis();
        return billDueDateEpoch >= startOfCurrentYearEpoch && billDueDateLuxon.month === monthInt;
      });

      return result;
    }
  }

  // if its year string contains "past", find all bills that are in the past and within the selected month
  if (yearParams.includes('past')) {
    if (yearParams.includes('include-today')) {
      const startOfTodayLuxon = currentTimeLuxon.startOf('day');
      const startOfTodayEpoch = startOfTodayLuxon.toMillis();

      const result: BillDueWithSubscription[] = billDues.filter((billDue: BillDueWithSubscription) => {
        const monthInt = Number.parseInt(monthParams);
        const billDueDateLuxon = DateTime.fromMillis(Number.parseInt(billDue.dueDate)).setZone(EST_TIME_ZONE);
        const billDueDateEpoch = billDueDateLuxon.toMillis();
        return billDueDateEpoch <= startOfTodayEpoch && billDueDateLuxon.month === monthInt;
      });

      return result;
    }

    if (yearParams.includes('include-current-year')) {
      const startOfCurrentYearLuxon = currentTimeLuxon.startOf('year');
      const startOfCurrentYearEpoch = startOfCurrentYearLuxon.toMillis();

      const result: BillDueWithSubscription[] = billDues.filter((billDue: BillDueWithSubscription) => {
        const monthInt = Number.parseInt(monthParams);
        const billDueDateLuxon = DateTime.fromMillis(Number.parseInt(billDue.dueDate)).setZone(EST_TIME_ZONE);
        const billDueDateEpoch = billDueDateLuxon.toMillis();
        return billDueDateEpoch <= startOfCurrentYearEpoch && billDueDateLuxon.month === monthInt;
      });

      return result;
    }
  }

  return [];
}

export function getSortedBillDues(billDues: BillDueWithSubscription[], sortData: SortDataModel): BillDueWithSubscription[] {
  const result: BillDueWithSubscription[] = billDues.toSorted((a: BillDueWithSubscription, b: BillDueWithSubscription) => {
    if (sortData?.sortField) {
      if (sortData.sortField === 'dueDate') {
        if (sortData.sortDirection === 'asc') {
          return Number.parseInt(a.dueDate) > Number.parseInt(b.dueDate) ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return Number.parseInt(a.dueDate) < Number.parseInt(b.dueDate) ? 1 : -1;
        }
        return 0;
      }
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
      if (sortData.sortField === 'subscription') {
        if (sortData.sortDirection === 'asc') {
          return a.subscription.name.toLowerCase() > b.subscription.name.toLowerCase() ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return a.subscription.name.toLowerCase() < b.subscription.name.toLowerCase() ? 1 : -1;
        }
      }

      if (sortData.sortField === 'cost') {
        const aCost = a.cost ?? a.subscription.cost;
        const bCost = b.cost ?? b.subscription.cost;
        if (sortData.sortDirection === 'asc') {
          return aCost > bCost ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return aCost < bCost ? 1 : -1;
        }
      }

      if (sortData.sortField === 'paid') {
        if (sortData.sortDirection === 'asc') {
          return a.paid > b.paid ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return a.paid < b.paid ? 1 : -1;
        }
      }

      if (sortData.sortField === 'reimbursed') {
        if (sortData.sortDirection === 'asc') {
          return a.reimbursed > b.reimbursed ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return a.reimbursed < b.reimbursed ? 1 : -1;
        }
      }

      if (sortData.sortField === 'frequency') {
        if (sortData.sortDirection === 'asc') {
          return a.subscription.billCycleDuration.toLowerCase() > b.subscription.billCycleDuration.toLowerCase() ? 1 : -1;
        } else if (sortData.sortDirection === 'desc') {
          return a.subscription.billCycleDuration.toLowerCase() < b.subscription.billCycleDuration.toLowerCase() ? 1 : -1;
        }
      }

      return a[sortData.sortField] > b[sortData.sortField] ? 1 : -1;
    }

    return 0;
  });

  return result;
}
