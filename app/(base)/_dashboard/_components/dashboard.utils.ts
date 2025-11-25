import z from 'zod';
import { DateTime } from 'luxon';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import { BillDueWithSubscriptionByMonthAndYear } from '@/models/bills/bills.model';
import { BillSearchParams, billSearchParamsSchema } from '@/validators/bills/bill.schema';

//const paramsToIgnore = ['editBillId', 'month', 'year', 'page'];

/**
 * Check if there are search params. If it's only 'page', it's not considered as search params.
 */
export function isSearchParamsExist(searchParams: z.infer<typeof billSearchParamsSchema>) {
  const searchParamsKeys: string[] = Object.keys(searchParams);
  const hasSearchParams: boolean = searchParamsKeys.length > 0;

  if (searchParamsKeys.length === 2 && searchParamsKeys.includes('month') && searchParamsKeys.includes('year')) {
    return false;
  }

  if (
    (searchParamsKeys.length === 3 &&
      searchParamsKeys.includes('month') &&
      searchParamsKeys.includes('year') &&
      searchParamsKeys.includes('page')) ||
    searchParamsKeys.includes('selectedMonthYear') ||
    searchParamsKeys.includes('editBillId')
  ) {
    return false;
  }

  return hasSearchParams;
}

export function isMonthSelectionSearchParamsExist(searchParams: z.infer<typeof billSearchParamsSchema>) {
  const searchParamsKeys: string[] = Object.keys(searchParams);

  if (searchParamsKeys.includes('selectedMonthYear')) {
    return true;
  }

  return false;
}

export function appendMonthAndYearToSearchParams(searchParams: BillSearchParams, dateParamsData: BillSearchParams) {
  // use server month and year if searchParams are not set
  const selectedMonthYear: string = searchParams.selectedMonthYear ?? `${dateParamsData.month}/${dateParamsData.year}`;
  // extract month and year
  const [month, year] = selectedMonthYear.split('/');
  return { ...searchParams, month: Number.parseInt(month).toString(), year: Number.parseInt(year).toString() };
}

export function getPreviousMonthLuxon(month: number, year: number): DateTime {
  return DateTime.fromObject(
    { month, year, hour: 0, minute: 0, second: 0, millisecond: 0 },
    {
      zone: EST_TIME_ZONE,
    },
  ).minus({ months: 1 });
}

export function getNextMonthLuxon(month: number, year: number): DateTime {
  return DateTime.fromObject(
    { month, year, hour: 0, minute: 0, second: 0, millisecond: 0 },
    {
      zone: EST_TIME_ZONE,
    },
  ).plus({ months: 1 });
}

export function getPercentIncreasedByPreviousMonth(
  currentMonthData: BillDueWithSubscriptionByMonthAndYear,
  previousMonthData: BillDueWithSubscriptionByMonthAndYear,
): number {
  if (currentMonthData.totalBillsCost === 0 && previousMonthData.totalBillsCost === 0) {
    return 0;
  }

  if (previousMonthData.totalBillsCost === 0) {
    return -1;
  }

  const increasePercentInt = (currentMonthData.totalBillsCost - previousMonthData.totalBillsCost) / previousMonthData.totalBillsCost;

  return increasePercentInt;
}
