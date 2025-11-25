/* eslint-disable no-console */
'use server';

import z from 'zod';
import { cache } from 'react';
import { DateTime } from 'luxon';
import uniqBy from 'lodash/uniqBy';
import { cacheLife } from 'next/cache';
// eslint-disable-next-line no-unused-vars
import { Prisma } from '@prisma/client';
import { cacheTag, updateTag } from 'next/cache';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

import prisma from '@/lib/prisma';
import { isNumeric } from '@/lib/number.utils';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { billAddableSchema, billEditableSchema, billSearchParamsSchema, AutoSelectedDefaultStatus } from '@/validators/bills/bill.schema';
import {
  BillDue,
  NavigationMonthData,
  BillsForCurrentMonth,
  CurrentMonthDateData,
  BillDueWithSubscription,
  BillDueWithSubscriptionByYear,
  BillDueWithSubscriptionAndSortData,
  BillDueWithSubscriptionByMonthAndYear,
} from '@/models/bills/bills.model';
import {
  DEFAULT_PAGE_SIZE,
  SORT_DATA_PAGE_IDS,
  CACHE_TAG_BILL_DUES_ALL,
  CACHE_TAG_SUBSCRIPTIONS_ALL,
  CACHE_TAG_BILL_DUES_BY_YEAR,
  CACHE_TAG_SUBSCRIPTION_DETAILS,
  CACHE_TAG_PAGINATION_DATA_PREFIX,
  CACHE_TAG_BILL_DUES_CURRENT_MONTH,
  CACHE_TAG_CURRENT_MONTH_DATE_DATA,
  CACHE_TAG_BILL_DUES_BY_MONTH_AND_YEAR,
  CACHE_TAG_BILL_DUES_CURRENT_MONTH_COUNT,
  CACHE_TAG_SUBSCRIPTION_BILLS_GROUPED_BY_YEAR,
} from '@/constants/constants';

import {
  getSortedBillDues,
  getFilteredBillDuesByYear,
  getFilteredBillDuesByMonth,
  getFilteredBillDuesBySpecialYear,
  getFilteredBillDuesBySpecialYearAndMonth,
} from './bills.server.utils';

export async function revalidatePaginationForPage(pageId: string) {
  updateTag(`${CACHE_TAG_PAGINATION_DATA_PREFIX}${pageId}`);
}

export async function revalidatePaginationForAllPages() {
  updateTag(`${CACHE_TAG_PAGINATION_DATA_PREFIX}${SORT_DATA_PAGE_IDS.search}`);
  updateTag(`${CACHE_TAG_PAGINATION_DATA_PREFIX}${SORT_DATA_PAGE_IDS.outstanding}`);
  updateTag(`${CACHE_TAG_PAGINATION_DATA_PREFIX}${SORT_DATA_PAGE_IDS.upcoming}`);
  updateTag(`${CACHE_TAG_PAGINATION_DATA_PREFIX}${SORT_DATA_PAGE_IDS.subscriptions}`);
}

export async function revalidateSubscriptionDetails(subscriptionId: string) {
  updateTag(`${CACHE_TAG_SUBSCRIPTION_DETAILS}${subscriptionId}`);
}

export async function revalidateSubscriptions() {
  updateTag(CACHE_TAG_SUBSCRIPTIONS_ALL);
}

export async function revalidateBillDue() {
  updateTag(CACHE_TAG_BILL_DUES_ALL);
}

export async function revalidateSubscriptionDetailsBillsDueGroupedByYear(subscriptionId: string) {
  updateTag(`${CACHE_TAG_SUBSCRIPTION_BILLS_GROUPED_BY_YEAR}${subscriptionId}`);
}

export async function revalidateBillsForCurrentMonth() {
  updateTag(CACHE_TAG_CURRENT_MONTH_DATE_DATA);
  // updateTag(CACHE_TAG_BILL_DUES_CURRENT_MONTH);
}

export async function revalidateCurrentMonthBillsCount() {
  updateTag(CACHE_TAG_BILL_DUES_CURRENT_MONTH_COUNT);
}

export const getCurrentMonthBillsCountCached = cache(async (month: string, year: string) => {
  const res = await getCurrentMonthBillsCount(month, year);
  return res;
});

export const getBillsForCurrentMonthCached = cache(async () => {
  const res = await getBillsForCurrentMonth();
  return res;
});

export const getAllBillsCached = cache(
  async (
    sortData: SortDataModel | null,
    paginationData: PaginationDataModel | null,
    searchParams?: z.infer<typeof billSearchParamsSchema>,
  ) => {
    const res = await getAllBills(sortData, paginationData, searchParams);
    return res;
  },
);

export const getAllOutstandingBillsCached = cache(
  async (
    sortData: SortDataModel | null,
    paginationData: PaginationDataModel | null,
    searchParams?: z.infer<typeof billSearchParamsSchema>,
  ) => {
    const res = await getAllBills(sortData, paginationData, searchParams, 'need-payment-or-reimbursement');
    return res;
  },
);

export const getAllUpcomingBillsCached = cache(
  async (
    sortData: SortDataModel | null,
    paginationData: PaginationDataModel | null,
    searchParams?: z.infer<typeof billSearchParamsSchema>,
  ) => {
    const res = await getAllBills(sortData, paginationData, searchParams, 'future-include-today');
    return res;
  },
);

export const getAllBillsCountCached = cache(async () => {
  const res = await getAllBillsCount();
  return res;
});

export const getCurrentMonthDateDataCached = cache(async () => {
  const res = await getCurrentMonthDateData();
  return res;
});

export const getAllBillsByMonthAndYearCached = cache(async (month: string | undefined, year: string | undefined) => {
  const res = await getAllBillsByMonthAndYear(month, year);
  return res;
});

export const getAllBillsByMonthAndYearParamsCached = cache(async (params: string | undefined, monthOffset?: number) => {
  const res = await getAllBillsByMonthAndYearParams(params, monthOffset);
  return res;
});

export const getAllBillsByYearFromParamsCached = cache(async (params: string | undefined, yearOffset?: number) => {
  const res = await getAllBillsByYearFromParams(params, yearOffset);
  return res;
});

export async function getAllBills(
  sortData: SortDataModel | null,
  paginationData: PaginationDataModel | null,
  searchParams?: z.infer<typeof billSearchParamsSchema>,
  autoSelectedDefaultStatus?: AutoSelectedDefaultStatus, // for outstanding and upcoming bills pages that have preselected status
): Promise<BillDueWithSubscriptionAndSortData> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_BILL_DUES_ALL);

  const whereClause: any = {
    AND: [],
  };

  if (autoSelectedDefaultStatus === 'need-payment-or-reimbursement') {
    whereClause.AND.push({
      OR: [{ paid: false }, { reimbursed: false }],
    });
  }

  if (searchParams?.subscriptions && searchParams.subscriptions.trim() !== '') {
    // subscriptions is a string of ids separated by commas
    const subscriptionIds = searchParams.subscriptions.split(',');
    whereClause.AND.push({
      subscriptionId: {
        in: subscriptionIds,
      },
    });
  }

  if (searchParams?.frequency && searchParams.frequency.trim() !== '') {
    // the billCycleDuration is a prop in the subscription that is included in the billDue
    const frequencies = searchParams.frequency.split(',');
    whereClause.AND.push({
      subscription: {
        billCycleDuration: {
          in: frequencies,
        },
      },
    });
  }

  if (searchParams?.paymentStatus && searchParams.paymentStatus.trim() !== '') {
    if (searchParams.paymentStatus === 'paid-only') {
      whereClause.AND.push({
        paid: true,
      });
    } else if (searchParams.paymentStatus === 'reimbursed-only') {
      whereClause.AND.push({
        reimbursed: true,
      });
    } else if (searchParams.paymentStatus === 'paid-or-reimbursed') {
      whereClause.AND.push({
        OR: [{ paid: true }, { reimbursed: true }],
      });
    } else if (searchParams.paymentStatus === 'paid-and-reimbursed') {
      whereClause.AND.push({
        paid: true,
        reimbursed: true,
      });
    } else if (searchParams.paymentStatus === 'need-payment-or-reimbursement') {
      whereClause.AND.push({
        OR: [{ paid: false }, { reimbursed: false }],
      });
    } else if (searchParams.paymentStatus === 'need-payment-and-reimbursement') {
      whereClause.AND.push({
        paid: false,
        reimbursed: false,
      });
    }
  }

  try {
    let billDues: BillDueWithSubscription[] = await prisma.billDue.findMany({
      include: {
        subscription: true,
        favorites: true,
      },
      where: whereClause,
    });

    // Due date related filters
    const yearParams: string | undefined = searchParams?.year;
    const monthParams: string | undefined = searchParams?.month;

    let startDateEpoch: number = 0;
    let endDateEpoch: number = 0;

    if (autoSelectedDefaultStatus === 'future-include-today') {
      const [filteredBillDues, startDateEpochLocal, endDateEpochLocal] = getFilteredBillDuesBySpecialYear(billDues, 'future-include-today');
      billDues = filteredBillDues;
      startDateEpoch = startDateEpochLocal;
      endDateEpoch = endDateEpochLocal;
    }

    if ((yearParams && yearParams.trim() !== '') || (monthParams && monthParams.trim() !== '')) {
      const doesMonthExist: boolean = !!(monthParams && monthParams.trim() !== '');
      const doesYearExist: boolean = !!(yearParams && yearParams.trim() !== '');

      const isYearInt: boolean = isNumeric(yearParams);

      // both month and year are numbers
      if (isYearInt && doesMonthExist && doesYearExist && monthParams && yearParams) {
        const [filteredBillDues, startDateEpochLocal, endDateEpochLocal] = getFilteredBillDuesByMonth(billDues, monthParams, yearParams);
        billDues = filteredBillDues;
        startDateEpoch = startDateEpochLocal;
        endDateEpoch = endDateEpochLocal;
      }
      // only year is a number
      else if (isYearInt && doesYearExist && yearParams) {
        const [filteredBillDues, startDateEpochLocal, endDateEpochLocal] = getFilteredBillDuesByYear(billDues, yearParams);
        billDues = filteredBillDues;
        startDateEpoch = startDateEpochLocal;
        endDateEpoch = endDateEpochLocal;
      }
      // only month is selected, auto default year to current year
      else if (!doesYearExist && doesMonthExist && monthParams) {
        const currentYear: number = DateTime.now().setZone(EST_TIME_ZONE).year;
        const [filteredBillDues, startDateEpochLocal, endDateEpochLocal] = getFilteredBillDuesByMonth(
          billDues,
          monthParams,
          currentYear.toString(),
        );
        billDues = filteredBillDues;
        startDateEpoch = startDateEpochLocal;
        endDateEpoch = endDateEpochLocal;
      }
      // if the year is special scenario
      else if (doesYearExist && !isYearInt && !doesMonthExist) {
        const [filteredBillDues, startDateEpochLocal, endDateEpochLocal] = getFilteredBillDuesBySpecialYear(billDues, yearParams ?? '');
        billDues = filteredBillDues;
        startDateEpoch = startDateEpochLocal;
        endDateEpoch = endDateEpochLocal;
      }
      // if the year is special and month is selected
      else if (doesYearExist && !isYearInt && doesMonthExist) {
        const [filteredBillDues, startDateEpochLocal, endDateEpochLocal] = getFilteredBillDuesBySpecialYearAndMonth(
          billDues,
          yearParams ?? '',
          monthParams ?? '',
        );
        billDues = filteredBillDues;
        startDateEpoch = startDateEpochLocal;
        endDateEpoch = endDateEpochLocal;
      }
    }

    // sort the bill dues
    if (sortData) {
      billDues = getSortedBillDues(billDues, sortData);
    }

    const pageSize: number = paginationData?.pageSize ?? DEFAULT_PAGE_SIZE;
    const totalPages: number = Math.ceil(billDues.length / pageSize);
    // page starts at 1
    const pageNumber: number =
      searchParams?.page && isNumeric(searchParams?.page) && Number.parseInt(`${searchParams?.page}`) > 0 ?
        Number.parseInt(`${searchParams?.page}`)
      : 1;

    const startIndex: number = (pageNumber - 1) * pageSize;
    // if we are on the last page, the end index should be the total number of bills
    const endIndex: number = pageNumber === totalPages ? billDues.length : startIndex + pageSize;
    const billDuesToReturn: BillDueWithSubscription[] = billDues.slice(startIndex, endIndex);

    const billDuesToReturnWithDateInEST: BillDueWithSubscription[] = billDuesToReturn.map((billDue) => {
      const dueDateInEst: string = DateTime.fromMillis(Number.parseInt(billDue.dueDate), {
        zone: EST_TIME_ZONE,
      }).toLocaleString(DateTime.DATETIME_SHORT);
      //const dueDateInEst: string = DateTime.fromMillis(Number.parseInt(billDue.dueDate)).setZone(EST_TIME_ZONE).toFormat('MM/dd/yyyy');

      const dateAddedInEstDate: Date = DateTime.fromJSDate(new Date(`${billDue.dateAdded}`))
        .setZone(EST_TIME_ZONE)
        .toJSDate();
      const dateAddedInEst: string = DateTime.fromJSDate(new Date(`${billDue.dateAdded}`))
        .setZone(EST_TIME_ZONE)
        .toLocaleString(DateTime.DATETIME_SHORT);
      //.toFormat('MM/dd/yyyy');
      const dateAddedRelativeDate = formatDistanceToNow(dateAddedInEstDate, { addSuffix: true });

      const updatedAtInEstDate: Date = DateTime.fromJSDate(new Date(`${billDue.updatedAt}`))
        .setZone(EST_TIME_ZONE)
        .toJSDate();
      const updatedAtInEst: string = DateTime.fromJSDate(new Date(`${billDue.updatedAt}`))
        .setZone(EST_TIME_ZONE)
        .toLocaleString(DateTime.DATETIME_SHORT);
      // .toFormat('MM/dd/yyyy');
      const updatedAtRelativeDate = formatDistanceToNow(updatedAtInEstDate, { addSuffix: true });

      return {
        ...billDue,
        dueDateInEst: dueDateInEst,
        dateAddedInEst: dateAddedInEst,
        dateAddedInEstRelative: dateAddedRelativeDate,
        updatedAtInEst: updatedAtInEst,
        updatedAtInEstRelative: updatedAtRelativeDate,
      };
    });

    return {
      billDues: billDuesToReturnWithDateInEST,
      sortData,
      totalPages,
      totalBillsCount: billDues.length,
      startIndex,
      endIndex,
      yearParams,
      monthParams,
      startDateEpoch,
      endDateEpoch,
    };
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getAllBills(): ', JSON.stringify(error));
    throw new Error(`Error retrieving bill dues. Code: ${error.code}`);
  }
}

async function getAllBillsByMonthAndYear(
  month: string | undefined,
  year: string | undefined,
): Promise<BillDueWithSubscriptionByMonthAndYear> {
  'use cache';

  // Due date related filters
  const yearParams: string | undefined = year;
  const monthParams: string | undefined = month;

  cacheLife('weeks');
  // TODO test this tag invalidation
  cacheTag(CACHE_TAG_BILL_DUES_BY_MONTH_AND_YEAR, `${CACHE_TAG_BILL_DUES_BY_MONTH_AND_YEAR}-${yearParams}-${monthParams}`);

  try {
    let billDues: BillDueWithSubscription[] = await prisma.billDue.findMany({
      include: {
        subscription: true,
        favorites: true,
      },
    });

    let startDateEpoch: number = 0;
    let endDateEpoch: number = 0;

    if ((yearParams && yearParams.trim() !== '') || (monthParams && monthParams.trim() !== '')) {
      const doesMonthExist: boolean = !!(monthParams && monthParams.trim() !== '');
      const doesYearExist: boolean = !!(yearParams && yearParams.trim() !== '');

      const isYearInt: boolean = isNumeric(yearParams);

      // both month and year are numbers
      if (isYearInt && doesMonthExist && doesYearExist && monthParams && yearParams) {
        const [filteredBillDues, startDateEpochLocal, endDateEpochLocal] = getFilteredBillDuesByMonth(billDues, monthParams, yearParams);
        billDues = filteredBillDues;
        startDateEpoch = startDateEpochLocal;
        endDateEpoch = endDateEpochLocal;
      }
      // only year is a number
      else if (isYearInt && doesYearExist && yearParams) {
        const [filteredBillDues, startDateEpochLocal, endDateEpochLocal] = getFilteredBillDuesByYear(billDues, yearParams);
        billDues = filteredBillDues;
        startDateEpoch = startDateEpochLocal;
        endDateEpoch = endDateEpochLocal;
      }
      // only month is selected, auto default year to current year
      else if (!doesYearExist && doesMonthExist && monthParams) {
        const currentYear: number = DateTime.now().setZone(EST_TIME_ZONE).year;
        const [filteredBillDues, startDateEpochLocal, endDateEpochLocal] = getFilteredBillDuesByMonth(
          billDues,
          monthParams,
          currentYear.toString(),
        );
        billDues = filteredBillDues;
        startDateEpoch = startDateEpochLocal;
        endDateEpoch = endDateEpochLocal;
      }
      // if the year is special scenario
      else if (doesYearExist && !isYearInt && !doesMonthExist) {
        const [filteredBillDues, startDateEpochLocal, endDateEpochLocal] = getFilteredBillDuesBySpecialYear(billDues, yearParams ?? '');
        billDues = filteredBillDues;
        startDateEpoch = startDateEpochLocal;
        endDateEpoch = endDateEpochLocal;
      }
      // if the year is special and month is selected
      else if (doesYearExist && !isYearInt && doesMonthExist) {
        const [filteredBillDues, startDateEpochLocal, endDateEpochLocal] = getFilteredBillDuesBySpecialYearAndMonth(
          billDues,
          yearParams ?? '',
          monthParams ?? '',
        );
        billDues = filteredBillDues;
        startDateEpoch = startDateEpochLocal;
        endDateEpoch = endDateEpochLocal;
      }
    }

    const totalBillsCost: number = billDues.reduce(
      (acc, billDue) => acc + Number.parseFloat(`${billDue.cost ?? billDue.subscription.cost ?? 0}`),
      0,
    );

    return {
      billDues: billDues,
      totalBillsCount: billDues.length,
      yearParams,
      monthParams,
      startDateEpoch,
      endDateEpoch,
      totalBillsCost,
    };
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getAllBillsByMonthAndYear(): ', JSON.stringify(error));
    throw new Error(`Error retrieving bill dues by month and year. Code: ${error.code}`);
  }
}

async function getAllBillsByMonthAndYearParams(
  params: string | undefined,
  monthOffset?: number,
): Promise<BillDueWithSubscriptionByMonthAndYear> {
  'use cache';

  let currentDateLuxon = DateTime.now().setZone(EST_TIME_ZONE);
  let currentYear: number = currentDateLuxon.year;
  let currentMonth: number = currentDateLuxon.month;

  let monthYearTag = `${currentMonth}-${currentYear}`;

  if (params) {
    const dateArray = params.split('/');
    const month: number = Number.parseInt(dateArray[0] ?? currentMonth.toString());
    const year: number = Number.parseInt(dateArray[1] ?? currentYear.toString());
    currentMonth = month;
    currentYear = year;
    currentDateLuxon = DateTime.fromObject(
      { month: currentMonth, year: currentYear },
      {
        zone: EST_TIME_ZONE,
      },
    );
    monthYearTag = `${month}-${year}`;
  }

  if (monthOffset !== undefined) {
    if (monthOffset > 0) {
      currentDateLuxon = currentDateLuxon.plus({ months: Math.abs(monthOffset) });
    } else if (monthOffset < 0) {
      currentDateLuxon = currentDateLuxon.minus({ months: Math.abs(monthOffset) });
    }
    currentMonth = currentDateLuxon.month;
    currentYear = currentDateLuxon.year;
  }

  cacheLife('weeks');
  // TODO test this tag invalidation
  cacheTag(CACHE_TAG_BILL_DUES_BY_MONTH_AND_YEAR, `${CACHE_TAG_BILL_DUES_BY_MONTH_AND_YEAR}-${monthYearTag}`);

  try {
    let billDues: BillDueWithSubscription[] = await prisma.billDue.findMany({
      include: {
        subscription: true,
        favorites: true,
      },
    });

    let startDateEpoch: number = 0;
    let endDateEpoch: number = 0;

    // both month and year are numbers
    const [filteredBillDues, startDateEpochLocal, endDateEpochLocal] = getFilteredBillDuesByMonth(
      billDues,
      currentMonth.toString(),
      currentYear.toString(),
    );

    billDues = filteredBillDues;
    startDateEpoch = startDateEpochLocal;
    endDateEpoch = endDateEpochLocal;

    const totalBillsCost: number = billDues.reduce(
      (acc, billDue) => acc + Number.parseFloat(`${billDue.cost ?? billDue.subscription.cost ?? 0}`),
      0,
    );

    return {
      billDues: billDues,
      totalBillsCount: billDues.length,
      yearParams: currentYear.toString(),
      monthParams: currentMonth.toString(),
      startDateEpoch,
      endDateEpoch,
      totalBillsCost,
    };
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getAllBillsByMonthAndYearParams(): ', JSON.stringify(error));
    throw new Error(`Error retrieving bill dues by month and year params. Code: ${error.code}`);
  }
}

async function getAllBillsByYearFromParams(params: string | undefined, yearOffset?: number): Promise<BillDueWithSubscriptionByYear> {
  'use cache';

  let currentDateLuxon = DateTime.now().setZone(EST_TIME_ZONE).startOf('year');
  let currentYear: number = currentDateLuxon.year;

  if (params) {
    const dateArray = params.split('/');
    const year: number = Number.parseInt(dateArray[1] ?? currentYear.toString());
    currentYear = year;
    currentDateLuxon = DateTime.fromObject(
      { month: 1, day: 1, year: currentYear },
      {
        zone: EST_TIME_ZONE,
      },
    );
  }

  if (yearOffset !== undefined) {
    if (yearOffset > 0) {
      currentDateLuxon = currentDateLuxon.plus({ years: Math.abs(yearOffset) });
    } else if (yearOffset < 0) {
      currentDateLuxon = currentDateLuxon.minus({ years: Math.abs(yearOffset) });
    }
    currentYear = currentDateLuxon.year;
  }

  cacheLife('weeks');
  // TODO test this tag invalidation
  cacheTag(CACHE_TAG_BILL_DUES_BY_YEAR, `${currentYear}`);

  try {
    let billDues: BillDueWithSubscription[] = await prisma.billDue.findMany({
      include: {
        subscription: true,
        favorites: true,
      },
    });

    let startDateEpoch: number = 0;
    let endDateEpoch: number = 0;

    // both month and year are numbers
    const [filteredBillDues, startDateEpochLocal, endDateEpochLocal] = getFilteredBillDuesByYear(billDues, currentYear.toString());

    billDues = filteredBillDues;
    startDateEpoch = startDateEpochLocal;
    endDateEpoch = endDateEpochLocal;

    const uniqueBySubscription: BillDueWithSubscription[] = uniqBy(filteredBillDues, 'subscription.id');

    const totalBillsCost: number = billDues.reduce(
      (acc, billDue) => acc + Number.parseFloat(`${billDue.cost ?? billDue.subscription.cost ?? 0}`),
      0,
    );

    return {
      billDues: billDues,
      totalBillsCount: billDues.length,
      yearParams: currentYear.toString(),
      monthParams: 'N/A',
      startDateEpoch,
      endDateEpoch,
      totalBillsCost,
      totalSubscriptionsCount: uniqueBySubscription.length,
      uniqueBySubscription: uniqueBySubscription,
    };
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getAllBillsByMonthAndYearParams(): ', JSON.stringify(error));
    throw new Error(`Error retrieving bill dues by month and year params. Code: ${error.code}`);
  }
}

export async function getAllBillsCount(): Promise<number> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_BILL_DUES_ALL);

  try {
    const billDues: BillDueWithSubscription[] = await prisma.billDue.findMany({
      include: {
        subscription: true,
      },
    });

    return billDues.length;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getAllBillsCount(): ', JSON.stringify(error));
    throw new Error(`Error retrieving bill dues count. Code: ${error.code}`);
  }
}

export async function getCurrentMonthBillsCount(month: string, year: string): Promise<number> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_BILL_DUES_CURRENT_MONTH_COUNT);

  try {
    const allBillsDue = await prisma.billDue.findMany({});

    const startDateLuxon = DateTime.fromObject(
      { month: Number.parseInt(month), year: Number.parseInt(year) },
      {
        zone: EST_TIME_ZONE,
      },
    ).startOf('month');
    const endDateLuxon = startDateLuxon.endOf('month');

    const filtered = allBillsDue.filter((billDue) => {
      const dueDateNumber = Number.parseInt(billDue.dueDate);
      return dueDateNumber >= startDateLuxon.toMillis() && dueDateNumber <= endDateLuxon.toMillis();
    });

    return filtered.length;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getCurrentMonthBillsCount(): ', JSON.stringify(error));
    throw new Error(`Error retrieving current month bill dues count. Code: ${error.code}`);
  }
}

async function getBillsForCurrentMonth(): Promise<BillsForCurrentMonth> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_BILL_DUES_CURRENT_MONTH);

  const currentDateLuxon = DateTime.now().setZone(EST_TIME_ZONE);
  const currentMonthStartLuxon = currentDateLuxon.startOf('month');
  const endOfMonthLuxon = currentDateLuxon.endOf('month');
  const monthName: string | null = DateTime.fromObject(
    { month: currentMonthStartLuxon.month },
    {
      zone: EST_TIME_ZONE,
    },
  ).monthLong;

  try {
    const allBillsDue: BillDueWithSubscription[] = await prisma.billDue.findMany({
      include: {
        favorites: true,
        subscription: true,
      },
    });

    const currentMonthBillsDue = allBillsDue.filter((billDue: BillDueWithSubscription) => {
      const billDueDateInMillis = Number.parseInt(billDue.dueDate);
      const currentMonthStartEpoch = currentMonthStartLuxon.toMillis();
      const endOfMonthEpoch = endOfMonthLuxon.toMillis();
      return billDueDateInMillis >= currentMonthStartEpoch && billDueDateInMillis <= endOfMonthEpoch;
    });

    return {
      bills: currentMonthBillsDue,
      month: currentMonthStartLuxon.month,
      monthName,
      startDate: currentMonthStartLuxon.toMillis(),
      endDate: endOfMonthLuxon.toMillis(),
    };
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getBillsForCurrentMonth(): ', JSON.stringify(error));
    throw new Error(`Error getting bills for current month. Code: ${error.code}`);
  }
}

export async function getCurrentMonthDateData(): Promise<CurrentMonthDateData> {
  'use cache';
  cacheLife('minutes');
  cacheTag(CACHE_TAG_CURRENT_MONTH_DATE_DATA);

  const currentDateLuxon = DateTime.now().setZone(EST_TIME_ZONE);
  const currentMonthStartLuxon = currentDateLuxon.startOf('month');
  const endOfMonthLuxon = currentDateLuxon.endOf('month');
  const monthName: string | null = DateTime.fromObject(
    { month: currentMonthStartLuxon.month },
    {
      zone: EST_TIME_ZONE,
    },
  ).monthLong;
  const currentYear: number = currentDateLuxon.year;
  const currentMonth: number = currentMonthStartLuxon.month;

  const previousMonthLuxon: DateTime = currentMonthStartLuxon.minus({ months: 1 });
  const nextMonthLuxon: DateTime = currentMonthStartLuxon.plus({ months: 1 });
  const nextMonthName = DateTime.fromObject(
    { month: currentMonthStartLuxon.month + 1 },
    {
      zone: EST_TIME_ZONE,
    },
  ).monthLong;
  const previousMonthName = DateTime.fromObject(
    { month: currentMonthStartLuxon.month - 1 },
    {
      zone: EST_TIME_ZONE,
    },
  ).monthLong;

  const previousMonth = previousMonthLuxon.month;
  const previousMonthYear = previousMonthLuxon.year;
  const nextMonth = nextMonthLuxon.month;
  const nextMonthYear = nextMonthLuxon.year;

  const dateSearchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>> = new Promise((resolve) => {
    resolve({
      month: currentMonthStartLuxon.month.toString(),
      year: currentYear.toString(),
    });
  });

  return {
    month: currentMonthStartLuxon.month,
    monthName,
    nextMonthName,
    previousMonthName,
    startDate: currentMonthStartLuxon.toMillis(),
    endDate: endOfMonthLuxon.toMillis(),
    currentYear,
    currentMonth,
    dateSearchParamsPromise,
    previousMonth,
    previousMonthYear,
    nextMonth,
    nextMonthYear,
  };
}

export async function getNavigationMonthData(
  currentMonth: number,
  currentYear: number,
  manuallySelectedMonthYear?: string,
): Promise<NavigationMonthData> {
  let cMonth = currentMonth;
  let cYear = currentYear;

  // MM/YYYY
  if (manuallySelectedMonthYear) {
    const [month, year] = manuallySelectedMonthYear.split('/');
    cMonth = Number.parseInt(month);
    cYear = Number.parseInt(year);
  }

  const currentDateLuxon: DateTime = DateTime.fromObject(
    {
      month: cMonth,
      year: cYear,
      day: 1,
    },
    { zone: EST_TIME_ZONE },
  );

  const previousMonthLuxon: DateTime = currentDateLuxon.minus({ months: 1 });
  const nextMonthLuxon: DateTime = currentDateLuxon.plus({ months: 1 });

  const isNextMonthTheCurrentMonth = nextMonthLuxon.month === currentMonth && nextMonthLuxon.year === currentYear;
  const isPreviousMonthTheCurrentMonth = previousMonthLuxon.month === currentMonth && previousMonthLuxon.year === currentYear;

  return {
    previousYear: previousMonthLuxon.year,
    previousMonth: previousMonthLuxon.month,
    previousMonthName: previousMonthLuxon.monthLong,
    nextYear: nextMonthLuxon.year,
    nextMonth: nextMonthLuxon.month,
    nextMonthName: nextMonthLuxon.monthLong,
    currentMonth: cMonth,
    currentMonthName: currentDateLuxon.monthLong,
    isNextMonthTheCurrentMonth,
    isPreviousMonthTheCurrentMonth,
  };
}

export async function updateIsBillDuePaid(billDueId: string, isPaid: boolean, subscriptionId: string): Promise<BillDue> {
  try {
    const billDue: BillDue = await prisma.billDue.update({
      where: { id: billDueId },
      data: { paid: isPaid },
    });

    revalidatePaginationForAllPages();
    revalidateBillDue();
    revalidateSubscriptionDetailsBillsDueGroupedByYear(subscriptionId);
    revalidateSubscriptionDetails(subscriptionId);
    revalidateSubscriptions();
    revalidateBillsForCurrentMonth();

    return billDue;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at updateIsBillDuePaid(): ', JSON.stringify(error));
    throw new Error(`Error updating bill due paid status. Code: ${error.code}`);
  }
}

export async function updateIsBillDueReimbursed(billDueId: string, isReimbursed: boolean, subscriptionId: string): Promise<BillDue> {
  try {
    const billDue: BillDue = await prisma.billDue.update({
      where: { id: billDueId },
      data: { reimbursed: isReimbursed },
    });

    revalidatePaginationForAllPages();
    revalidateBillDue();
    revalidateSubscriptionDetailsBillsDueGroupedByYear(subscriptionId);
    revalidateSubscriptionDetails(subscriptionId);
    revalidateSubscriptions();
    revalidateBillsForCurrentMonth();

    return billDue;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at updateIsBillDueReimbursed(): ', JSON.stringify(error));
    throw new Error(`Error updating bill due reimbursed status. Code: ${error.code}`);
  }
}

export async function updateBillDue(billDueId: string, data: z.infer<typeof billEditableSchema>): Promise<BillDueWithSubscription> {
  const billCost: number = Number.parseFloat(`${data.cost}`);
  try {
    const billDue: BillDueWithSubscription = await prisma.billDue.update({
      where: { id: billDueId },
      data: {
        cost: billCost,
        dueDate: data.dueDate,
        paid: data.paid,
        reimbursed: data.reimbursed,
        subscriptionId: data.subscriptionId,
      },
      include: {
        subscription: true,
      },
    });

    revalidatePaginationForAllPages();
    revalidateBillDue();
    revalidateSubscriptionDetailsBillsDueGroupedByYear(billDue.subscriptionId);
    revalidateSubscriptionDetails(billDue.subscriptionId);
    revalidateSubscriptions();
    revalidateBillsForCurrentMonth();

    return billDue;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at updateBillDue(): ', JSON.stringify(error));
    throw new Error(`Error updating bill due. Code: ${error.code}`);
  }
}

export async function getBillDueById(billDueId: string): Promise<BillDueWithSubscription | null> {
  try {
    const billDue: BillDueWithSubscription | null = await prisma.billDue.findUnique({
      where: { id: billDueId },
      include: {
        subscription: true,
        favorites: true,
      },
    });

    return billDue;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getBillDueById(): ', JSON.stringify(error));
    throw new Error(`Error retrieving bill due. Code: ${error.code}`);
  }
}

export async function deleteBillDue(billDueId: string): Promise<BillDueWithSubscription> {
  try {
    const billDue: BillDueWithSubscription = await prisma.billDue.delete({
      where: { id: billDueId },
      include: {
        subscription: true,
      },
    });

    revalidatePaginationForAllPages();
    revalidateBillDue();
    revalidateSubscriptionDetailsBillsDueGroupedByYear(billDue.subscriptionId);
    revalidateSubscriptionDetails(billDue.subscriptionId);
    revalidateSubscriptions();
    revalidateBillsForCurrentMonth();

    return billDue;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at deleteBillDue(): ', JSON.stringify(error));
    throw new Error(`Error deleting bill due. Code: ${error.code}`);
  }
}

export async function addBillDue(subscriptionId: string, payload: z.infer<typeof billAddableSchema>): Promise<BillDueWithSubscription> {
  const billCost: number = Number.parseFloat(`${payload.cost}`);

  try {
    const billDue: BillDueWithSubscription = await prisma.billDue.create({
      data: {
        subscriptionId,
        dueDate: payload.dueDate,
        paid: payload.paid ?? false,
        reimbursed: payload.reimbursed ?? false,
        cost: billCost,
      },
      include: {
        subscription: true,
      },
    });

    revalidatePaginationForAllPages();
    revalidateBillDue();
    revalidateSubscriptionDetailsBillsDueGroupedByYear(subscriptionId);
    revalidateSubscriptionDetails(subscriptionId);
    revalidateSubscriptions();
    revalidateBillsForCurrentMonth();

    return billDue;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at addBillDue(): ', JSON.stringify(error));
    throw new Error(`Error adding bill due. Code: ${error.code}`);
  }
}
