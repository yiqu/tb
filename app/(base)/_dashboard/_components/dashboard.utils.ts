import z from 'zod';
import { DateTime } from 'luxon';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import { BillDueWithSubscriptionByMonthAndYear } from '@/models/bills/bills.model';
import { BillSearchParams, billSearchParamsSchema } from '@/validators/bills/bill.schema';

/**
 * Check if there are search params.  month and year will always be there.
 */
export function isSearchParamsExist(searchParams: z.infer<typeof billSearchParamsSchema>) {
  const searchParamsKeys: string[] = Object.keys(searchParams);
  const paramsWithOutInitialParams = searchParamsKeys.filter((key) => key !== 'month' && key !== 'year');

  if (paramsWithOutInitialParams.length > 0) {
    return true;
  }

  return false;
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
