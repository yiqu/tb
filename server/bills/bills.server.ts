/* eslint-disable no-console */
'use server';

import z from 'zod';
import { cache } from 'react';
import { DateTime } from 'luxon';
import uniqBy from 'lodash/uniqBy';
// eslint-disable-next-line no-unused-vars
import { Prisma } from '@prisma/client';
import { cacheTag, updateTag } from 'next/cache';
import { cacheLife, revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';
import { isNumeric } from '@/lib/number.utils';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { FavoriteEntity } from '@/models/favorites/favorite.model';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { AllBillsChartNode, DashboardYearBillsChartData } from '@/models/charts/chart.model';
import { billAddableSchema, billEditableSchema, billSearchParamsSchema, AutoSelectedDefaultStatus } from '@/validators/bills/bill.schema';
import {
  BillDue,
  NavigationMonthData,
  BillsForCurrentMonth,
  CurrentMonthDateData,
  SubscriptionOriginal,
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
  CACHE_TAG_BILL_DUES_OUTSTANDING_PRIOR_MONTHS,
} from '@/constants/constants';

import {
  BillDueDateFilter,
  getSortedBillDues,
  getBillDueDbOrderBy,
  getBillDuesTotalCost,
  getDueDateRangeWhere,
  getBillDueWithDatesInEst,
  getBillDueDateFilterByYear,
  getBillDueDateFilterByMonth,
  getBillDueDateFilterFromParams,
  getBillDueDateFilterBySpecialYear,
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
  updateTag(CACHE_TAG_BILL_DUES_OUTSTANDING_PRIOR_MONTHS);
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

export async function revalidateSubscriptionDetailsPathBySubscriptionId() {
  revalidatePath(`/(base)/subscriptions/[subscriptionId]`, 'page');
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

export const getEntireBillsCached = cache(async () => {
  const res = await getEntireBills();
  return res;
});

export const getEntireBillsChartDataCached = cache(async () => {
  const res = await getEntireBillsChartData();
  return res;
});

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

export const getOutstandingBillsCountForPriorMonthsCached = cache(async () => {
  const res = await getOutstandingBillsCountForPriorMonths();
  return res;
});

export const getOutstandingBillsCountForMonthAndYearCached = cache(async (selectedMonthYear: string | undefined) => {
  const res = await getOutstandingBillsCountForMonthAndYear(selectedMonthYear);
  return res;
});

export async function getEntireBills() {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_BILL_DUES_ALL);

  try {
    const billDues: BillDueWithSubscription[] = await prisma.billDue.findMany({
      include: {
        subscription: true,
      },
    });

    return await getBillDuesWithFavorites(billDues);
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getEntireBills(): ', JSON.stringify(error));
    throw new Error(`Error retrieving entire bill dues. Code: ${error.code}`);
  }
}

export async function getEntireBillsChartData(): Promise<DashboardYearBillsChartData> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_BILL_DUES_ALL);

  // let the database sort by due date (indexed). Favorites are not needed for the chart.
  const billDues: BillDueWithSubscription[] = await prisma.billDue.findMany({
    include: {
      subscription: true,
    },
    orderBy: [{ dueDate: 'asc' }, { id: 'asc' }],
  });

  if (billDues.length === 0) {
    return {
      subscriptions: [],
      chartData: [],
    };
  }

  const allUniqueSubscriptions: SubscriptionOriginal[] = uniqBy(billDues, 'subscription.id').map(
    (billDue: BillDueWithSubscription) => billDue.subscription,
  );

  const firstBillDue: BillDueWithSubscription = billDues[0];

  // first bill due's month starting date, as the beginning point for the chart's first node
  const firstBillDueMonthStart = DateTime.fromMillis(Number.parseInt(firstBillDue.dueDate), {
    zone: EST_TIME_ZONE,
  }).startOf('month');

  // final chart node
  const lastBillDue = billDues[billDues.length - 1];
  const lastBillDueDate: number = Number.parseInt(lastBillDue.dueDate);

  // get the list of months' nodes for beginning to end
  const results: AllBillsChartNode[] = [];
  let monthLuxon = firstBillDueMonthStart;
  while (monthLuxon.toMillis() < lastBillDueDate) {
    results.push({
      billDues: [],
      dateStart: monthLuxon.toMillis(),
      dateEnd: monthLuxon.endOf('month').toMillis(),
      displayName: `${monthLuxon.month}/${monthLuxon.year}`,
      month: monthLuxon.month,
      year: monthLuxon.year,
      totalCost: 0,
    });
    monthLuxon = monthLuxon.plus({ months: 1 }).startOf('month');
  }

  // now append the bills for each month node.
  // both the bills and the month nodes are sorted by date, so a single pass with a moving pointer is enough
  let monthNodeIndex: number = 0;
  for (const bill of billDues) {
    const billDueDate: number = Number.parseInt(bill.dueDate);

    while (monthNodeIndex < results.length && billDueDate > results[monthNodeIndex].dateEnd) {
      monthNodeIndex++;
    }

    const resultAtNode: AllBillsChartNode | undefined = results[monthNodeIndex];
    if (!resultAtNode || billDueDate < resultAtNode.dateStart) {
      continue;
    }

    const billDueCost: number = bill.cost ?? bill.subscription.cost ?? 0;

    resultAtNode.billDues.push(bill);
    resultAtNode.totalCost = resultAtNode.totalCost + billDueCost;

    // if subscription name property already exist
    const subscriptionResultAtNode: any = resultAtNode[bill.subscription.name];
    if (subscriptionResultAtNode) {
      subscriptionResultAtNode.billDues.push(bill);
      subscriptionResultAtNode.totalCost = subscriptionResultAtNode.totalCost + billDueCost;
    } else {
      resultAtNode[bill.subscription.name] = {
        billDues: [bill],
        totalCost: billDueCost,
      };
    }
  }

  return {
    subscriptions: allUniqueSubscriptions,
    chartData: results,
    firstBillDue: firstBillDue,
    lastBillDue: lastBillDue,
  };
}

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

  if (searchParams?.['bills__cost'] && searchParams['bills__cost'].trim() !== '') {
    const costRaw: string = searchParams['bills__cost'].trim();
    let operator: 'equals' | 'gte' | 'lte' | 'gt' | 'lt' = 'equals';
    let numericPart: string = costRaw;

    if (costRaw.startsWith('>=')) {
      operator = 'gte';
      numericPart = costRaw.slice(2);
    } else if (costRaw.startsWith('<=')) {
      operator = 'lte';
      numericPart = costRaw.slice(2);
    } else if (costRaw.startsWith('>')) {
      operator = 'gt';
      numericPart = costRaw.slice(1);
    } else if (costRaw.startsWith('<')) {
      operator = 'lt';
      numericPart = costRaw.slice(1);
    }

    const trimmed = numericPart.trim();
    const costValue = Number(trimmed);
    if (trimmed !== '' && Number.isFinite(costValue)) {
      whereClause.AND.push({
        OR: [{ cost: { [operator]: costValue } }, { cost: null, subscription: { cost: { [operator]: costValue } } }],
      });
    }
  }

  if (searchParams?.['bills__subscription'] && searchParams['bills__subscription'].trim() !== '') {
    const subscriptionName: string = searchParams['bills__subscription'].trim();
    whereClause.AND.push({
      subscription: {
        name: { contains: subscriptionName, mode: 'insensitive' },
      },
    });
  }

  if (searchParams?.['bills__frequency'] && searchParams['bills__frequency'].trim() !== '') {
    const frequencyRaw: string = searchParams['bills__frequency'].trim();
    whereClause.AND.push({
      subscription: {
        billCycleDuration: { contains: frequencyRaw, mode: 'insensitive' },
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

  // Due date related filters
  const yearParams: string | undefined = searchParams?.year;
  const monthParams: string | undefined = searchParams?.month;

  let startDateEpoch: number = 0;
  let endDateEpoch: number = 0;

  // the due date filters are applied one after another (same order as before): upcoming first, then year / month
  const dueDateFilters: BillDueDateFilter[] = [];
  if (autoSelectedDefaultStatus === 'future-include-today') {
    dueDateFilters.push(getBillDueDateFilterBySpecialYear('future-include-today'));
  }
  const paramsDueDateFilter: BillDueDateFilter | null = getBillDueDateFilterFromParams(yearParams, monthParams);
  if (paramsDueDateFilter) {
    dueDateFilters.push(paramsDueDateFilter);
  }

  for (const dueDateFilter of dueDateFilters) {
    if (dueDateFilter.where) {
      whereClause.AND.push(dueDateFilter.where);
    }
    startDateEpoch = dueDateFilter.startDateEpoch;
    endDateEpoch = dueDateFilter.endDateEpoch;
  }

  const pageSize: number = paginationData?.pageSize ?? DEFAULT_PAGE_SIZE;
  // page starts at 1
  const pageNumber: number =
    searchParams?.page && isNumeric(searchParams?.page) && Number.parseInt(`${searchParams?.page}`) > 0 ?
      Number.parseInt(`${searchParams?.page}`)
    : 1;
  const startIndex: number = (pageNumber - 1) * pageSize;

  const dbOrderBy = getBillDueDbOrderBy(sortData);
  const canFilterInDb: boolean = dueDateFilters.every((dueDateFilter) => dueDateFilter.isExactInDb);

  try {
    let billDuesToReturn: BillDueWithSubscription[] = [];
    let totalBillsCount: number = 0;

    if (dbOrderBy && canFilterInDb) {
      // Fast path: the database filters, sorts and paginates. Only one page of bills is loaded.
      const [count, pageOfBillDues] = await Promise.all([
        prisma.billDue.count({ where: whereClause }),
        prisma.billDue.findMany({
          include: {
            subscription: true,
          },
          where: whereClause,
          orderBy: dbOrderBy,
          skip: startIndex,
          take: pageSize,
        }),
      ]);

      totalBillsCount = count;
      billDuesToReturn = pageOfBillDues;
    } else {
      // The sort depends on the subscription (name, frequency, cost fallback), or the due date filter needs a
      // check the database can not do. The database still narrows the bills down as much as it can.
      let billDues: BillDueWithSubscription[] = await prisma.billDue.findMany({
        include: {
          subscription: true,
        },
        where: whereClause,
      });

      for (const dueDateFilter of dueDateFilters) {
        [billDues] = dueDateFilter.filterInMemory(billDues);
      }

      // sort the bill dues
      if (sortData) {
        billDues = getSortedBillDues(billDues, sortData);
      }

      totalBillsCount = billDues.length;
      billDuesToReturn = billDues.slice(startIndex, startIndex + pageSize);
    }

    const totalPages: number = Math.ceil(totalBillsCount / pageSize);
    // if we are on the last page, the end index should be the total number of bills
    const endIndex: number = pageNumber === totalPages ? totalBillsCount : startIndex + pageSize;

    // favorites are only needed for the bills on the page
    const billDuesToReturnWithFavorites: BillDueWithSubscription[] = await getBillDuesWithFavorites(billDuesToReturn);
    const billDuesToReturnWithDateInEST: BillDueWithSubscription[] = billDuesToReturnWithFavorites.map(getBillDueWithDatesInEst);

    return {
      billDues: billDuesToReturnWithDateInEST,
      sortData,
      totalPages,
      totalBillsCount,
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
    // only load the bills within the requested time range
    const dueDateFilter: BillDueDateFilter | null = getBillDueDateFilterFromParams(yearParams, monthParams);

    const billDues: BillDueWithSubscription[] = await getBillDuesWithinDateFilter(dueDateFilter);
    const startDateEpoch: number = dueDateFilter?.startDateEpoch ?? 0;
    const endDateEpoch: number = dueDateFilter?.endDateEpoch ?? 0;

    const totalBillsCost: number = getBillDuesTotalCost(billDues);

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
    // only load the bills of the selected month
    const dueDateFilter: BillDueDateFilter = getBillDueDateFilterByMonth(currentMonth.toString(), currentYear.toString());
    const billDues: BillDueWithSubscription[] = await getBillDuesWithinDateFilter(dueDateFilter);
    const { startDateEpoch, endDateEpoch } = dueDateFilter;

    const totalBillsCost: number = getBillDuesTotalCost(billDues);

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
  cacheLife('weeks');

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

  // TODO test this tag invalidation
  cacheTag(CACHE_TAG_BILL_DUES_BY_YEAR, `${CACHE_TAG_BILL_DUES_BY_YEAR}-${currentYear}`);

  try {
    // only load the bills of the selected year
    const dueDateFilter: BillDueDateFilter = getBillDueDateFilterByYear(currentYear.toString());
    const billDues: BillDueWithSubscription[] = await getBillDuesWithinDateFilter(dueDateFilter);
    const { startDateEpoch, endDateEpoch } = dueDateFilter;

    const uniqueBySubscription: BillDueWithSubscription[] = uniqBy(billDues, 'subscription.id');

    const totalBillsCost: number = getBillDuesTotalCost(billDues);

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

/**
 * Loads the bills (with subscription and favorites) that match a due date filter.
 * The database does the filtering whenever the filter can be expressed as a query.
 */
async function getBillDuesWithinDateFilter(dueDateFilter: BillDueDateFilter | null): Promise<BillDueWithSubscription[]> {
  let billDues: BillDueWithSubscription[] = await prisma.billDue.findMany({
    include: {
      subscription: true,
    },
    where: dueDateFilter?.where ?? undefined,
  });

  if (dueDateFilter && !dueDateFilter.isExactInDb) {
    [billDues] = dueDateFilter.filterInMemory(billDues);
  }

  return getBillDuesWithFavorites(billDues);
}

// above this many bills it is cheaper to read every bill favorite than to send one condition per bill
const MAX_BILL_DUE_IDS_PER_FAVORITES_QUERY = 100;

/**
 * Attaches the favorites to a list of bill dues with one query.
 *
 * `include: { favorites: true }` on a list makes Prisma send one "billDueId equals ..." condition per bill,
 * which gets very slow as the list grows. Favorites are few, so for long lists all bill favorites are read instead.
 */
async function getBillDuesWithFavorites(billDues: BillDueWithSubscription[]): Promise<BillDueWithSubscription[]> {
  if (billDues.length === 0) {
    return billDues;
  }

  const favorites: FavoriteEntity[] = await prisma.favoriteEntity.findMany({
    where:
      billDues.length <= MAX_BILL_DUE_IDS_PER_FAVORITES_QUERY ?
        { billDueId: { in: billDues.map((billDue: BillDueWithSubscription) => billDue.id) } }
      : { entityType: 'BILL_DUE' },
  });

  const favoritesByBillDueId = new Map<string, FavoriteEntity[]>();
  for (const favorite of favorites) {
    if (!favorite.billDueId) {
      continue;
    }
    const favoritesOfBillDue: FavoriteEntity[] | undefined = favoritesByBillDueId.get(favorite.billDueId);
    if (favoritesOfBillDue) {
      favoritesOfBillDue.push(favorite);
    } else {
      favoritesByBillDueId.set(favorite.billDueId, [favorite]);
    }
  }

  return billDues.map((billDue: BillDueWithSubscription) => ({
    ...billDue,
    favorites: favoritesByBillDueId.get(billDue.id) ?? [],
  }));
}

export async function getAllBillsCount(): Promise<number> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_BILL_DUES_ALL);

  try {
    return await prisma.billDue.count();
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
    const startDateLuxon = DateTime.fromObject(
      { month: Number.parseInt(month), year: Number.parseInt(year) },
      {
        zone: EST_TIME_ZONE,
      },
    ).startOf('month');
    const endDateLuxon = startDateLuxon.endOf('month');
    const startDateEpoch: number = startDateLuxon.toMillis();
    const endDateEpoch: number = endDateLuxon.toMillis();

    const dueDateWhere = getDueDateRangeWhere(startDateEpoch, endDateEpoch);
    if (dueDateWhere) {
      return await prisma.billDue.count({ where: dueDateWhere });
    }

    // the range can not be compared in the database (dates before 2001), count in memory
    const allBillsDue = await prisma.billDue.findMany({ select: { dueDate: true } });

    return allBillsDue.filter((billDue) => {
      const dueDateNumber = Number.parseInt(billDue.dueDate);
      return dueDateNumber >= startDateEpoch && dueDateNumber <= endDateEpoch;
    }).length;
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
    // only load the bills of the current month
    const currentMonthBillsDue: BillDueWithSubscription[] = await getBillDuesWithFavorites(
      await prisma.billDue.findMany({
        include: {
          subscription: true,
        },
        where: getDueDateRangeWhere(currentMonthStartLuxon.toMillis(), endOfMonthLuxon.toMillis()) ?? undefined,
      }),
    );

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
  'use cache';
  cacheLife('max');

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

export async function getOutstandingBillsCountForPriorMonths(): Promise<number> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_BILL_DUES_OUTSTANDING_PRIOR_MONTHS);

  const currentDateLuxon = DateTime.now().setZone(EST_TIME_ZONE);
  const endOfMonthLuxon = currentDateLuxon.endOf('month');
  return getOutstandingBillsCount(null, endOfMonthLuxon.toMillis());
}

/**
 * Counts the bills that still need a payment or a reimbursement within an inclusive due date range.
 */
async function getOutstandingBillsCount(startDateEpoch: number | null, endDateEpoch: number): Promise<number> {
  const outstandingWhere: Prisma.BillDueWhereInput = { OR: [{ paid: false }, { reimbursed: false }] };
  const dueDateWhere = getDueDateRangeWhere(startDateEpoch, endDateEpoch);

  if (dueDateWhere) {
    return prisma.billDue.count({ where: { AND: [dueDateWhere, outstandingWhere] } });
  }

  // the range can not be compared in the database (dates before 2001), count in memory
  const outstandingBillsDue = await prisma.billDue.findMany({ where: outstandingWhere, select: { dueDate: true } });

  return outstandingBillsDue.filter((bill) => {
    const dueDate = Number.parseInt(bill.dueDate);
    return dueDate <= endDateEpoch && (startDateEpoch === null || dueDate >= startDateEpoch);
  }).length;
}

export async function getOutstandingBillsCountForMonthAndYear(selectedMonthYear: string | undefined): Promise<number> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_BILL_DUES_OUTSTANDING_PRIOR_MONTHS);

  const currentDateLuxon = DateTime.now().setZone(EST_TIME_ZONE);
  let startOfMonthLuxon = currentDateLuxon.startOf('month');
  let endOfMonthLuxon = currentDateLuxon.endOf('month');

  if (selectedMonthYear) {
    // 11/2025
    const [month, year] = selectedMonthYear.split('/');
    let monthLuxon = DateTime.fromObject(
      {
        month: Number.parseInt(month),
        year: Number.parseInt(year),
        day: 1,
      },
      {
        zone: EST_TIME_ZONE,
      },
    );

    startOfMonthLuxon = monthLuxon.startOf('month');
    endOfMonthLuxon = monthLuxon.endOf('month');
  }

  return getOutstandingBillsCount(startOfMonthLuxon.toMillis(), endOfMonthLuxon.toMillis());
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
    updateTag(CACHE_TAG_BILL_DUES_BY_YEAR);
    updateTag(CACHE_TAG_BILL_DUES_BY_MONTH_AND_YEAR);
    revalidateSubscriptionDetailsPathBySubscriptionId();

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
    updateTag(CACHE_TAG_BILL_DUES_BY_YEAR);
    updateTag(CACHE_TAG_BILL_DUES_BY_MONTH_AND_YEAR);
    revalidateSubscriptionDetailsPathBySubscriptionId();

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
    updateTag(CACHE_TAG_BILL_DUES_BY_YEAR);
    updateTag(CACHE_TAG_BILL_DUES_BY_MONTH_AND_YEAR);

    return billDue;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at updateBillDue(): ', JSON.stringify(error));
    throw new Error(`Error updating bill due. Code: ${error.code}`);
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
    updateTag(CACHE_TAG_BILL_DUES_BY_YEAR);
    updateTag(CACHE_TAG_BILL_DUES_BY_MONTH_AND_YEAR);

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
    updateTag(CACHE_TAG_BILL_DUES_BY_YEAR);
    updateTag(CACHE_TAG_BILL_DUES_BY_MONTH_AND_YEAR);

    return billDue;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at addBillDue(): ', JSON.stringify(error));
    throw new Error(`Error adding bill due. Code: ${error.code}`);
  }
}
