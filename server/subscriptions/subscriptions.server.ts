/* eslint-disable no-console */
'use server';

import z from 'zod';
import { cache } from 'react';
import { DateTime } from 'luxon';
import { cacheLife } from 'next/cache';
// eslint-disable-next-line no-unused-vars
import { Prisma } from '@prisma/client';
import { cacheTag, updateTag } from 'next/cache';

import prisma from '@/lib/prisma';
import { isNumeric } from '@/lib/number.utils';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { FavoriteEntity } from '@/models/favorites/favorite.model';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { BillDue, BillDueWithSubscription, BillsDueGroupedByYearObject } from '@/models/bills/bills.model';
import {
  SubscriptionOriginal,
  SubscriptionWithBillDues,
  SubscriptionWithBillDuesAndSortData,
} from '@/models/subscriptions/subscriptions.model';
import {
  subscriptionAddableSchema,
  subscriptionEditableSchema,
  subscriptionSearchParamsSchema,
} from '@/validators/subscriptions/subscriptions.schema';
import {
  DEFAULT_PAGE_SIZE,
  CACHE_TAG_BILL_DUES_ALL,
  CACHE_TAG_FAVORITES_ALL,
  CACHE_TAG_SUBSCRIPTIONS_ALL,
  CACHE_TAG_BILL_DUES_BY_YEAR,
  CACHE_TAG_SUBSCRIPTION_DETAILS,
  CACHE_TAG_BILL_DUES_CURRENT_MONTH,
  CACHE_TAG_CURRENT_MONTH_DATE_DATA,
  CACHE_TAG_BILL_DUES_BY_MONTH_AND_YEAR,
  CACHE_TAG_SUBSCRIPTION_BILLS_GROUPED_BY_YEAR,
} from '@/constants/constants';

import { getBillDueWithDatesInEst } from '../bills/bills.server.utils';
import { getSortedSubscriptions, SUBSCRIPTION_OWN_SORT_FIELDS } from './subscriptions.utils';
import { transformSubscriptionExtraProps, attachSubscriptionToBillDues } from './utils';

export async function revalidateBillDue() {
  updateTag(CACHE_TAG_BILL_DUES_ALL);
}

export async function revalidateSubscriptions() {
  updateTag(CACHE_TAG_SUBSCRIPTIONS_ALL);
}

export async function revalidateSubscriptionDetails(subscriptionId: string) {
  updateTag(`${CACHE_TAG_SUBSCRIPTION_DETAILS}${subscriptionId}`);
}

export async function revalidateSubscriptionDetailsBillsDueGroupedByYear(subscriptionId: string) {
  updateTag(`${CACHE_TAG_SUBSCRIPTION_BILLS_GROUPED_BY_YEAR}${subscriptionId}`);
}

export const getAllSubscriptionsCached = cache(async () => {
  const res = await getAllSubscriptions();
  return res;
});

export const getAllSubscriptionsWithBillDuesCached = cache(async () => {
  const res = await getAllSubscriptionsWithBillDues();
  return res;
});

export const getAllSubscriptionsWithBillDuesPaginatedCached = cache(
  async (
    sortData: SortDataModel | null,
    paginationData: PaginationDataModel | null,
    searchParams?: z.infer<typeof subscriptionSearchParamsSchema>,
  ) => {
    const res = await getAllSubscriptionsWithBillDuesPaginated(sortData, paginationData, searchParams);
    return res;
  },
);

export const getAllSubscriptionsCountCached = cache(async () => {
  const res = await getAllSubscriptionsCount();
  return res;
});

export const getAllSubscriptionsBareCached = cache(async () => {
  const res = await getAllSubscriptionsBare();
  return res;
});

export const getSubscriptionWithBillDuesByIdCached = cache(async (subscriptionId: string) => {
  const res = await getSubscriptionWithBillDuesById(subscriptionId);
  return res;
});

export const getSubscriptionBillsGroupedByYearByIdCached = cache(async (subscriptionId: string) => {
  const res = await getSubscriptionBillsGroupedByYearById(subscriptionId);
  return res;
});

export async function getAllSubscriptions(): Promise<SubscriptionOriginal[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_SUBSCRIPTIONS_ALL);

  try {
    const subscriptions: SubscriptionOriginal[] = await prisma.subscription.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return subscriptions;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getAllSubscriptions(): ', JSON.stringify(error));
    throw new Error(`Error retrieving subscriptions. Code: ${error.code}`);
  }
}

/**
 * Subscriptions main table
 *
 * @param sortData
 * @param paginationData
 * @param searchParams
 * @returns SubscriptionWithBillDuesAndSortData
 */
export async function getAllSubscriptionsWithBillDuesPaginated(
  sortData: SortDataModel | null,
  paginationData: PaginationDataModel | null,
  searchParams?: z.infer<typeof subscriptionSearchParamsSchema>,
): Promise<SubscriptionWithBillDuesAndSortData> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_SUBSCRIPTIONS_ALL);

  const whereClause: any = {
    AND: [],
  };

  if (searchParams?.subscriptions && searchParams.subscriptions.trim() !== '') {
    // subscriptions is a string of ids separated by commas
    const subscriptionIds = searchParams.subscriptions.split(',');
    whereClause.AND.push({
      id: {
        in: subscriptionIds,
      },
    });
  }

  if (searchParams?.frequency && searchParams.frequency.trim() !== '') {
    // the billCycleDuration is a prop in the subscription that is included in the billDue
    const frequencies = searchParams.frequency.split(',');
    whereClause.AND.push({
      billCycleDuration: {
        in: frequencies,
      },
    });
  }

  if (searchParams?.['subscriptions__cost'] && searchParams['subscriptions__cost'].trim() !== '') {
    const costRaw: string = searchParams['subscriptions__cost'].trim();
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
        cost: { [operator]: costValue },
      });
    }
  }

  if (searchParams?.['subscriptions__name'] && searchParams['subscriptions__name'].trim() !== '') {
    const name: string = searchParams['subscriptions__name'].trim();
    whereClause.AND.push({
      name: { contains: name, mode: 'insensitive' },
    });
  }

  if (searchParams?.['subscriptions__billCycleDuration'] && searchParams['subscriptions__billCycleDuration'].trim() !== '') {
    const frequency: string = searchParams['subscriptions__billCycleDuration'].trim();
    whereClause.AND.push({
      billCycleDuration: { contains: frequency, mode: 'insensitive' },
    });
  }

  if (searchParams?.['subscriptions__description'] && searchParams['subscriptions__description'].trim() !== '') {
    const description: string = searchParams['subscriptions__description'].trim();
    whereClause.AND.push({
      description: { contains: description, mode: 'insensitive' },
    });
  }

  if (searchParams?.['subscriptions__url'] && searchParams['subscriptions__url'].trim() !== '') {
    const url: string = searchParams['subscriptions__url'].trim();
    whereClause.AND.push({
      url: { contains: url, mode: 'insensitive' },
    });
  }

  try {
    // Subscriptions are loaded without their bills first. The bills are only loaded for the subscriptions that need them.
    const subscriptionsOnly: SubscriptionOriginal[] = await prisma.subscription.findMany({
      where: whereClause.AND.length > 0 ? whereClause : {},
    });

    const pageSize: number = paginationData?.pageSize ?? DEFAULT_PAGE_SIZE;
    const totalPages: number = Math.ceil(subscriptionsOnly.length / pageSize);

    let startDateEpoch: number = 0;
    let endDateEpoch: number = Infinity;

    // if undefined, set to current year
    const currentYearDateTime: DateTime = DateTime.now().setZone(EST_TIME_ZONE);
    const currentYear: number = currentYearDateTime.year;
    let selectedYearParam: string = searchParams?.year ?? currentYear.toString(); // e.g. 2025

    if (selectedYearParam !== 'all') {
      const currentYearStartLuxon = DateTime.fromObject(
        {
          year: Number.parseInt(selectedYearParam),
          month: 1,
          day: 1,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        },
        {
          zone: EST_TIME_ZONE,
        },
      );
      const currentYearEndLuxon = currentYearStartLuxon.endOf('year');
      startDateEpoch = currentYearStartLuxon.toMillis();
      endDateEpoch = currentYearEndLuxon.toMillis();
    }

    // Pagination
    // page starts at 1
    const pageNumber: number =
      searchParams?.page && isNumeric(searchParams?.page) && Number.parseInt(`${searchParams?.page}`) > 0 ?
        Number.parseInt(`${searchParams?.page}`)
      : 1;

    const startIndex: number = (pageNumber - 1) * pageSize;
    // if we are on the last page, the end index should be the total number of bills
    const endIndex: number = pageNumber === totalPages ? subscriptionsOnly.length : startIndex + pageSize;

    // Sorting by a value that is calculated from the bills (e.g. total cost) needs the bills of every subscription.
    // Sorting by one of the subscription's own fields only needs the bills of the subscriptions on the requested page.
    const isSortedByBillDues: boolean = !!sortData?.sortField && !SUBSCRIPTION_OWN_SORT_FIELDS.includes(sortData.sortField);

    let subscriptionsToReturn: SubscriptionWithBillDues[];

    if (isSortedByBillDues && sortData) {
      const subscriptionsWithBillDues: SubscriptionWithBillDues[] = await getSubscriptionsWithTheirBillDues(
        subscriptionsOnly,
        whereClause.AND.length === 0,
      );
      const transformed: SubscriptionWithBillDues[] = transformSubscriptionExtraProps(subscriptionsWithBillDues, startDateEpoch, endDateEpoch);
      subscriptionsToReturn = getSortedSubscriptions(transformed, sortData).slice(startIndex, endIndex);
    } else {
      // the sort only reads the subscription's own fields, so it can run before the bills are loaded
      const sorted = sortData ? getSortedSubscriptions(subscriptionsOnly as SubscriptionWithBillDues[], sortData) : subscriptionsOnly;
      const subscriptionsOnPage: SubscriptionWithBillDues[] = await getSubscriptionsWithTheirBillDues(sorted.slice(startIndex, endIndex), false);
      subscriptionsToReturn = transformSubscriptionExtraProps(subscriptionsOnPage, startDateEpoch, endDateEpoch);
    }

    // favorites are only needed for the subscriptions on the page
    const favorites: FavoriteEntity[] =
      subscriptionsToReturn.length > 0 ?
        await prisma.favoriteEntity.findMany({
          where: { subscriptionId: { in: subscriptionsToReturn.map((subscription) => subscription.id) } },
        })
      : [];
    subscriptionsToReturn = subscriptionsToReturn.map((subscription: SubscriptionWithBillDues) => ({
      ...subscription,
      favorites: favorites.filter((favorite: FavoriteEntity) => favorite.subscriptionId === subscription.id),
    }));

    return {
      subscriptions: subscriptionsToReturn,
      sortData,
      totalPages,
      totalSubscriptionsCount: subscriptionsOnly.length,
      startIndex,
      endIndex,
    };
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getAllSubscriptionsWithBillDuesPaginated(): ', JSON.stringify(error));
    const errorCode = error?.code || 'UNKNOWN';
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    throw new Error(`Error retrieving subscriptions with bill dues. Code: ${errorCode}, Message: ${errorMessage}`);
  }
}

/**
 * Loads the bill dues of the given subscriptions with a single query and attaches them.
 *
 * @param subscriptions subscriptions without bill dues
 * @param isEverySubscription true when the list holds every subscription - no id filter is needed then
 */
async function getSubscriptionsWithTheirBillDues(
  subscriptions: SubscriptionOriginal[],
  isEverySubscription: boolean,
): Promise<SubscriptionWithBillDues[]> {
  if (subscriptions.length === 0) {
    return [];
  }

  const billDues: BillDue[] = await prisma.billDue.findMany({
    where: isEverySubscription ? undefined : { subscriptionId: { in: subscriptions.map((subscription) => subscription.id) } },
  });

  const billDuesBySubscriptionId = new Map<string, BillDue[]>();
  for (const billDue of billDues) {
    const billDuesOfSubscription: BillDue[] | undefined = billDuesBySubscriptionId.get(billDue.subscriptionId);
    if (billDuesOfSubscription) {
      billDuesOfSubscription.push(billDue);
    } else {
      billDuesBySubscriptionId.set(billDue.subscriptionId, [billDue]);
    }
  }

  return subscriptions.map((subscription: SubscriptionOriginal) =>
    attachSubscriptionToBillDues(subscription, billDuesBySubscriptionId.get(subscription.id) ?? []),
  );
}

async function getAllSubscriptionsWithBillDues(): Promise<SubscriptionWithBillDues[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_SUBSCRIPTIONS_ALL);

  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        billDues: true,
      },
    });

    return subscriptions.map((subscription) => attachSubscriptionToBillDues(subscription));
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getAllSubscriptionsWithBillDues(): ', JSON.stringify(error));
    throw new Error(`Error retrieving subscriptions with bill dues. Code: ${error.code}`);
  }
}

async function getAllSubscriptionsBare(): Promise<SubscriptionOriginal[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_SUBSCRIPTIONS_ALL);

  try {
    const subscriptions: SubscriptionOriginal[] = await prisma.subscription.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return subscriptions;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getAllSubscriptionsBare(): ', JSON.stringify(error));
    throw new Error(`Error retrieving subscriptions. Code: ${error.code}`);
  }
}

export async function getSubscriptionWithBillDuesById(subscriptionId: string): Promise<SubscriptionWithBillDues | null> {
  'use cache';
  cacheLife('weeks');
  cacheTag(`${CACHE_TAG_SUBSCRIPTION_DETAILS}${subscriptionId}`);

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        billDues: true,
      },
    });

    return subscription ? attachSubscriptionToBillDues(subscription) : null;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getSubscriptionWithBillDuesById(): ', JSON.stringify(error));
    throw new Error(`Error retrieving subscription by id. Code: ${error.code}`);
  }
}

export async function getSubscriptionWithBillDuesByIdUncached(subscriptionId: string): Promise<SubscriptionWithBillDues | null> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        billDues: true,
      },
    });

    return subscription ? attachSubscriptionToBillDues(subscription) : null;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getSubscriptionWithBillDuesById(): ', JSON.stringify(error));
    throw new Error(`Error retrieving subscription by id. Code: ${error.code}`);
  }
}

export async function getAllSubscriptionsWithBillDuesByIdsUncached(subscriptionIds: string[]): Promise<SubscriptionWithBillDues[]> {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { id: { in: subscriptionIds } },
      include: {
        billDues: true,
      },
    });

    return subscriptions.map((subscription) => attachSubscriptionToBillDues(subscription));
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getAllSubscriptionsWithBillDuesByIdsUncached(): ', JSON.stringify(error));
    throw new Error(`Error retrieving subscriptions by ids. Code: ${error.code}`);
  }
}

export async function getSubscriptionBillsGroupedByYearById(subscriptionId: string): Promise<BillsDueGroupedByYearObject[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(`${CACHE_TAG_SUBSCRIPTION_BILLS_GROUPED_BY_YEAR}${subscriptionId}`);

  try {
    // the database returns the bills newest first (indexed), so no extra sorting is needed afterwards
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        billDues: {
          orderBy: { dueDate: 'desc' },
        },
      },
    });

    const billDues: BillDueWithSubscription[] = subscription ? attachSubscriptionToBillDues(subscription).billDues : [];

    // group by year. Map keeps the insertion order, which is newest year first
    const billDuesGroupedByYear = new Map<number, BillDueWithSubscription[]>();
    for (const billDue of billDues) {
      const { year } = DateTime.fromMillis(Number.parseInt(billDue.dueDate), {
        zone: EST_TIME_ZONE,
      });
      const billDueWithDatesInEst: BillDueWithSubscription = getBillDueWithDatesInEst(billDue);
      const billsOfYear: BillDueWithSubscription[] | undefined = billDuesGroupedByYear.get(year);
      if (billsOfYear) {
        billsOfYear.push(billDueWithDatesInEst);
      } else {
        billDuesGroupedByYear.set(year, [billDueWithDatesInEst]);
      }
    }

    const sortedBillsDueGroupedByYear: BillsDueGroupedByYearObject[] = [...billDuesGroupedByYear.entries()].map(([year, bills]) => ({
      year: year.toString(),
      bills,
    }));

    return sortedBillsDueGroupedByYear;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getSubscriptionBillsGroupedByYearById(): ', JSON.stringify(error));
    throw new Error(`Error retrieving getSubscriptionBillsGroupedByYearById. Code: ${error.code}`);
  }
}

export async function updateSubscription(
  subscriptionId: string,
  payload: z.infer<typeof subscriptionEditableSchema>,
): Promise<SubscriptionWithBillDues> {
  try {
    const savedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        name: payload.name,
        description: payload.description,
        url: payload.url,
        approved: payload.approved,
        signed: payload.signed,
        cost: Number.parseFloat(`${payload.cost}`),
        billCycleDuration: payload.billCycleDuration,
      },
      include: {
        billDues: true,
      },
    });
    const subscription: SubscriptionWithBillDues = attachSubscriptionToBillDues(savedSubscription);

    revalidateSubscriptions();
    revalidateSubscriptionDetailsBillsDueGroupedByYear(subscriptionId);
    revalidateSubscriptionDetails(subscriptionId);
    revalidateBillDue();

    return subscription;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at updateSubscription(): ', JSON.stringify(error));
    throw new Error(`Error updating subscription. Code: ${error.code}`);
  }
}

export async function getAllSubscriptionsCount(): Promise<number> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_SUBSCRIPTIONS_ALL);

  try {
    return await prisma.subscription.count();
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getAllSubscriptionsCount(): ', JSON.stringify(error));
    throw new Error(`Error retrieving subscriptions count. Code: ${error.code}`);
  }
}

export async function updateIsSubscriptionApproved(subscriptionId: string, isApproved: boolean): Promise<SubscriptionWithBillDues> {
  try {
    const savedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { approved: isApproved },
      include: {
        billDues: true,
      },
    });
    const subscription: SubscriptionWithBillDues = attachSubscriptionToBillDues(savedSubscription);

    revalidateSubscriptions();
    revalidateSubscriptionDetailsBillsDueGroupedByYear(subscriptionId);
    revalidateSubscriptionDetails(subscriptionId);

    return subscription;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at updateIsSubscriptionApproved(): ', JSON.stringify(error));
    throw new Error(`Error updating subscription approved status. Code: ${error.code}`);
  }
}

export async function updateIsSubscriptionSigned(subscriptionId: string, isSigned: boolean): Promise<SubscriptionWithBillDues> {
  try {
    const savedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { signed: isSigned },
      include: {
        billDues: true,
      },
    });
    const subscription: SubscriptionWithBillDues = attachSubscriptionToBillDues(savedSubscription);

    revalidateSubscriptions();
    revalidateSubscriptionDetailsBillsDueGroupedByYear(subscriptionId);
    revalidateSubscriptionDetails(subscriptionId);

    return subscription;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at updateIsSubscriptionSigned(): ', JSON.stringify(error));
    throw new Error(`Error updating subscription signed status. Code: ${error.code}`);
  }
}

export async function createNewSubscription(payload: z.infer<typeof subscriptionAddableSchema>): Promise<SubscriptionWithBillDues> {
  try {
    const savedSubscription = await prisma.subscription.create({
      data: {
        name: payload.name,
        description: payload.description,
        url: payload.url,
        approved: payload.approved,
        signed: payload.signed,
        cost: Number.parseFloat(`${payload.cost}`),
        billCycleDuration: payload.billCycleDuration,
      },
      include: {
        billDues: true,
      },
    });
    const subscription: SubscriptionWithBillDues = attachSubscriptionToBillDues(savedSubscription);

    revalidateSubscriptions();
    revalidateSubscriptionDetailsBillsDueGroupedByYear(subscription.id);
    revalidateSubscriptionDetails(subscription.id);
    revalidateBillDue();

    return subscription;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at createNewSubscription(): ', JSON.stringify(error));
    throw new Error(`Error creating new subscription. Code: ${error.code}`);
  }
}

export async function deleteSubscription(subscriptionId: string): Promise<SubscriptionWithBillDues> {
  try {
    // the bills and the favorite of the subscription do not depend on each other, delete them at the same time
    await Promise.all([
      prisma.billDue.deleteMany({
        where: {
          subscriptionId: subscriptionId,
        },
      }),
      //delete the favorite associated with the subscription
      prisma.favoriteEntity.deleteMany({
        where: {
          subscriptionId: subscriptionId,
        },
      }),
    ]);

    const savedSubscription = await prisma.subscription.delete({
      where: { id: subscriptionId },
      include: {
        billDues: true,
      },
    });
    const subscription: SubscriptionWithBillDues = attachSubscriptionToBillDues(savedSubscription);

    updateTag(CACHE_TAG_FAVORITES_ALL);
    revalidateSubscriptions();
    revalidateSubscriptionDetailsBillsDueGroupedByYear(subscriptionId);
    revalidateSubscriptionDetails(subscriptionId);
    revalidateBillDue();

    return subscription;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at deleteSubscription(): ', JSON.stringify(error));
    throw new Error(`Error deleting subscription. Code: ${error.code}`);
  }
}

export async function deleteAllSubscriptions(): Promise<void> {
  try {
    await prisma.billDue.deleteMany();
    await prisma.favoriteEntity.deleteMany();
    await prisma.subscription.deleteMany();

    updateTag(CACHE_TAG_FAVORITES_ALL);
    revalidateSubscriptions();
    revalidateBillDue();
    updateTag(CACHE_TAG_BILL_DUES_ALL);
    updateTag(CACHE_TAG_BILL_DUES_BY_MONTH_AND_YEAR);
    updateTag(CACHE_TAG_BILL_DUES_BY_YEAR);
    updateTag(CACHE_TAG_BILL_DUES_CURRENT_MONTH);
    updateTag(CACHE_TAG_CURRENT_MONTH_DATE_DATA);

    return;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at deleteAllSubscriptions(): ', JSON.stringify(error));
    throw new Error(`Error deleting all subscriptions. Code: ${error.code}`);
  }
}
