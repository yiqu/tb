import { DateTime } from 'luxon';
import type { Prisma } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

import { isNumeric } from '@/lib/number.utils';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { BillDueWithSubscription } from '@/models/bills/bills.model';

export function getFilteredBillDuesByMonth(
  billDues: BillDueWithSubscription[],
  monthParams: string,
  yearParams: string,
): [BillDueWithSubscription[], number, number] {
  let monthInt: number = Number.parseInt(monthParams);
  let yearInt: number = Number.parseInt(yearParams);

  if (monthParams === 'current-month') {
    const currentMonthLuxon = DateTime.now().setZone(EST_TIME_ZONE).startOf('month');
    monthInt = currentMonthLuxon.month;
  } else if (monthParams === 'last-month') {
    const lastMonthLuxon = DateTime.now().setZone(EST_TIME_ZONE).startOf('month').minus({ months: 1 });
    monthInt = lastMonthLuxon.month;
    yearInt = lastMonthLuxon.year;
  } else if (monthParams === 'next-month') {
    const nextMonthLuxon = DateTime.now().setZone(EST_TIME_ZONE).startOf('month').plus({ months: 1 });
    monthInt = nextMonthLuxon.month;
    yearInt = nextMonthLuxon.year;
  }

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

  return [result, startMonthEpoch, endMonthEpoch];
}

export function getFilteredBillDuesByYear(
  billDues: BillDueWithSubscription[],
  yearParams: string,
): [BillDueWithSubscription[], number, number] {
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

  return [result, startYearEpoch, endYearEpoch];
}

export function getFilteredBillDuesBySpecialYear(
  billDues: BillDueWithSubscription[],
  yearParams: string,
): [BillDueWithSubscription[], number, number] {
  const currentTimeLuxon = DateTime.now().setZone(EST_TIME_ZONE);
  const startOfTodayLuxon = currentTimeLuxon.startOf('day');
  const startOfTodayEpoch = startOfTodayLuxon.toMillis();
  const endOfTodayLuxon = currentTimeLuxon.endOf('day');
  const endOfTodayEpoch = endOfTodayLuxon.toMillis();

  const startOfCurrentYearLuxon = currentTimeLuxon.startOf('year');
  const endOfCurrentYearLuxon = currentTimeLuxon.endOf('year');
  const startOfCurrentYearEpoch = startOfCurrentYearLuxon.toMillis();
  const endOfCurrentYearEpoch = endOfCurrentYearLuxon.toMillis();

  if (yearParams === 'future-include-today') {
    const result: BillDueWithSubscription[] = billDues.filter((billDue: BillDueWithSubscription) => {
      const billDueDateEpoch: number = Number.parseInt(billDue.dueDate);
      return billDueDateEpoch >= startOfTodayEpoch;
    });

    return [result, startOfTodayEpoch, 0];
  } else if (yearParams === 'past-include-today') {
    const result: BillDueWithSubscription[] = billDues.filter((billDue: BillDueWithSubscription) => {
      const billDueDateEpoch: number = Number.parseInt(billDue.dueDate);
      return billDueDateEpoch <= endOfTodayEpoch;
    });

    return [result, 0, endOfTodayEpoch];
  } else if (yearParams === 'future-include-current-year') {
    const result: BillDueWithSubscription[] = billDues.filter((billDue: BillDueWithSubscription) => {
      const billDueDateEpoch: number = Number.parseInt(billDue.dueDate);
      return billDueDateEpoch >= startOfCurrentYearEpoch;
    });

    return [result, startOfCurrentYearEpoch, 0];
  } else if (yearParams === 'past-include-current-year') {
    const result: BillDueWithSubscription[] = billDues.filter((billDue: BillDueWithSubscription) => {
      const billDueDateEpoch: number = Number.parseInt(billDue.dueDate);
      return billDueDateEpoch <= endOfCurrentYearEpoch;
    });

    return [result, 0, endOfCurrentYearEpoch];
  }

  return [[], 0, 0];
}

export function getFilteredBillDuesBySpecialYearAndMonth(
  billDues: BillDueWithSubscription[],
  yearParams: string,
  monthParams: string,
): [BillDueWithSubscription[], number, number] {
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

      return [result, startOfTodayEpoch, 0];
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

      return [result, startOfCurrentYearEpoch, 0];
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

      return [result, 0, startOfTodayEpoch];
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

      return [result, 0, startOfCurrentYearEpoch];
    }
  }

  return [[], 0, 0];
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

/**
 * Due dates are stored as epoch-millisecond strings (e.g. '1716267600000').
 * MongoDB compares strings lexicographically, which matches numeric order only while both sides have the same
 * number of digits. Every epoch between 2001-09-09 and 2286-11-20 has exactly 13 digits, so range bounds in that
 * window can be pushed down to the database (and use the dueDate indexes).
 */
const MIN_13_DIGIT_EPOCH = 1_000_000_000_000;
const MAX_13_DIGIT_EPOCH = 9_999_999_999_999;

function isDbComparableEpoch(epoch: number): boolean {
  return Number.isInteger(epoch) && epoch >= MIN_13_DIGIT_EPOCH && epoch <= MAX_13_DIGIT_EPOCH;
}

/**
 * Build a Prisma `dueDate` filter for an inclusive epoch range. Pass `null` for an open-ended bound.
 * Returns `null` when a bound can not be compared safely as a string - the caller must filter in memory then.
 */
export function getDueDateRangeWhere(startEpoch: number | null, endEpoch: number | null): Prisma.BillDueWhereInput | null {
  if ((startEpoch !== null && !isDbComparableEpoch(startEpoch)) || (endEpoch !== null && !isDbComparableEpoch(endEpoch))) {
    return null;
  }

  const dueDate: Prisma.StringFilter<'BillDue'> = {};
  if (startEpoch !== null) {
    dueDate.gte = startEpoch.toString();
  }
  if (endEpoch !== null) {
    dueDate.lte = endEpoch.toString();
  }

  return { dueDate };
}

export interface BillDueDateFilter {
  // epochs returned to the UI (0 means "open ended", same as before)
  startDateEpoch: number;
  endDateEpoch: number;
  // database filter for the due date. null = no database filter could be built
  where: Prisma.BillDueWhereInput | null;
  // true when the database filter alone returns exactly the wanted bills
  isExactInDb: boolean;
  // in memory version of the filter - always exact
  filterInMemory: (billDues: BillDueWithSubscription[]) => [BillDueWithSubscription[], number, number];
}

const MATCH_NOTHING_WHERE: Prisma.BillDueWhereInput = { id: { in: [] } };

function createBillDueDateFilter(
  filterInMemory: BillDueDateFilter['filterInMemory'],
  bounds: { start: number | null; end: number | null } | 'match-nothing',
  hasExtraInMemoryCondition: boolean = false,
): BillDueDateFilter {
  // run the in memory filter on an empty list just to read the epochs it reports
  const [, startDateEpoch, endDateEpoch] = filterInMemory([]);

  if (bounds === 'match-nothing') {
    return { startDateEpoch, endDateEpoch, where: MATCH_NOTHING_WHERE, isExactInDb: true, filterInMemory };
  }

  const where: Prisma.BillDueWhereInput | null = getDueDateRangeWhere(bounds.start, bounds.end);

  return {
    startDateEpoch,
    endDateEpoch,
    where,
    isExactInDb: where !== null && !hasExtraInMemoryCondition,
    filterInMemory,
  };
}

export function getBillDueDateFilterByMonth(monthParams: string, yearParams: string): BillDueDateFilter {
  const [, start, end] = getFilteredBillDuesByMonth([], monthParams, yearParams);
  return createBillDueDateFilter((billDues) => getFilteredBillDuesByMonth(billDues, monthParams, yearParams), { start, end });
}

export function getBillDueDateFilterByYear(yearParams: string): BillDueDateFilter {
  const [, start, end] = getFilteredBillDuesByYear([], yearParams);
  return createBillDueDateFilter((billDues) => getFilteredBillDuesByYear(billDues, yearParams), { start, end });
}

/**
 * Translates the year / month search params into a due date filter.
 * Mirrors the branching the bills table always had, but lets the database do the filtering when possible.
 * Returns null when there is no due date filter to apply.
 */
export function getBillDueDateFilterFromParams(yearParams: string | undefined, monthParams: string | undefined): BillDueDateFilter | null {
  const doesMonthExist: boolean = !!(monthParams && monthParams.trim() !== '');
  const doesYearExist: boolean = !!(yearParams && yearParams.trim() !== '');

  if (!doesMonthExist && !doesYearExist) {
    return null;
  }

  const isYearInt: boolean = isNumeric(yearParams);

  // both month and year are numbers
  if (isYearInt && doesMonthExist && doesYearExist && monthParams && yearParams) {
    return getBillDueDateFilterByMonth(monthParams, yearParams);
  }

  // only year is a number
  if (isYearInt && doesYearExist && yearParams) {
    return getBillDueDateFilterByYear(yearParams);
  }

  // only month is selected, auto default year to current year
  if (!doesYearExist && doesMonthExist && monthParams) {
    const currentYear: string = DateTime.now().setZone(EST_TIME_ZONE).year.toString();
    return getBillDueDateFilterByMonth(monthParams, currentYear);
  }

  // if the year is special scenario
  if (doesYearExist && !isYearInt && !doesMonthExist) {
    return getBillDueDateFilterBySpecialYear(yearParams ?? '');
  }

  // if the year is special and month is selected
  if (doesYearExist && !isYearInt && doesMonthExist) {
    const year: string = yearParams ?? '';
    const month: string = monthParams ?? '';
    const filterInMemory: BillDueDateFilter['filterInMemory'] = (billDues) => getFilteredBillDuesBySpecialYearAndMonth(billDues, year, month);
    const [, start, end] = filterInMemory([]);

    // the "is in the selected month, for any year" part can only be checked in memory,
    // the database still narrows the bills down to the future / past part
    if (year.includes('future') && (year.includes('include-today') || year.includes('include-current-year'))) {
      return createBillDueDateFilter(filterInMemory, { start, end: null }, true);
    }
    if (year.includes('past') && (year.includes('include-today') || year.includes('include-current-year'))) {
      return createBillDueDateFilter(filterInMemory, { start: null, end }, true);
    }
    return createBillDueDateFilter(filterInMemory, 'match-nothing');
  }

  return null;
}

export function getBillDueDateFilterBySpecialYear(yearParams: string): BillDueDateFilter {
  const filterInMemory: BillDueDateFilter['filterInMemory'] = (billDues) => getFilteredBillDuesBySpecialYear(billDues, yearParams);
  const [, start, end] = filterInMemory([]);

  if (yearParams === 'future-include-today' || yearParams === 'future-include-current-year') {
    return createBillDueDateFilter(filterInMemory, { start, end: null });
  }
  if (yearParams === 'past-include-today' || yearParams === 'past-include-current-year') {
    return createBillDueDateFilter(filterInMemory, { start: null, end });
  }

  return createBillDueDateFilter(filterInMemory, 'match-nothing');
}

const DB_SORTABLE_BILL_DUE_FIELDS = ['dueDate', 'dateAdded', 'updatedAt', 'paid', 'reimbursed'] as const;

/**
 * Sort fields that live on the bill due document itself can be sorted (and paginated) by the database.
 * Fields that depend on the subscription (name, frequency, cost fallback) still need the in memory sort.
 * Returns null when the sort has to happen in memory.
 */
export function getBillDueDbOrderBy(sortData: SortDataModel | null): Prisma.BillDueOrderByWithRelationInput[] | null {
  if (!sortData?.sortField) {
    return [{ id: 'asc' }];
  }

  const { sortDirection } = sortData;
  const sortField = DB_SORTABLE_BILL_DUE_FIELDS.find((field) => field === sortData.sortField);

  if (!sortField || (sortDirection !== 'asc' && sortDirection !== 'desc')) {
    return null;
  }

  // id as the tie breaker keeps pagination stable.
  // Its direction is the opposite of the sort field so both directions can walk the [field desc, id asc] indexes
  return [{ [sortField]: sortDirection }, { id: sortDirection === 'desc' ? 'asc' : 'desc' }];
}

/**
 * Adds the display friendly date strings (EST) to a bill due.
 */
export function getBillDueWithDatesInEst<T extends BillDueWithSubscription>(billDue: T): T {
  const dueDateInEst: string = DateTime.fromMillis(Number.parseInt(billDue.dueDate), {
    zone: EST_TIME_ZONE,
  }).toLocaleString(DateTime.DATETIME_SHORT);

  const dateAddedLuxon: DateTime = DateTime.fromJSDate(new Date(`${billDue.dateAdded}`)).setZone(EST_TIME_ZONE);
  const updatedAtLuxon: DateTime = DateTime.fromJSDate(new Date(`${billDue.updatedAt}`)).setZone(EST_TIME_ZONE);

  return {
    ...billDue,
    dueDateInEst: dueDateInEst,
    dateAddedInEst: dateAddedLuxon.toLocaleString(DateTime.DATETIME_SHORT),
    dateAddedInEstRelative: formatDistanceToNow(dateAddedLuxon.toJSDate(), { addSuffix: true }),
    updatedAtInEst: updatedAtLuxon.toLocaleString(DateTime.DATETIME_SHORT),
    updatedAtInEstRelative: formatDistanceToNow(updatedAtLuxon.toJSDate(), { addSuffix: true }),
  };
}

export function getBillDuesTotalCost(billDues: BillDueWithSubscription[]): number {
  return billDues.reduce((acc, billDue) => acc + Number.parseFloat(`${billDue.cost ?? billDue.subscription.cost ?? 0}`), 0);
}
