/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
'use server';

import z from 'zod';
import { cache } from 'react';
import { DateTime } from 'luxon';
import { Prisma } from '@prisma/client';
import { unstable_cacheLife as cacheLife } from 'next/cache';
import { revalidateTag, unstable_cacheTag as cacheTag } from 'next/cache';

import prisma from '@/lib/prisma';
import { isNumeric } from '@/lib/number.utils';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { BillDueGroupedByYear, BillDueWithSubscription, BillsDueGroupedByYearObject } from '@/models/bills/bills.model';
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
  CACHE_TAG_SUBSCRIPTIONS_ALL,
  CACHE_TAG_SUBSCRIPTION_DETAILS,
  CACHE_TAG_SUBSCRIPTION_BILLS_GROUPED_BY_YEAR,
} from '@/constants/constants';

import { getSortedSubscriptions } from './subscriptions.utils';

export async function revalidateBillDue() {
  revalidateTag(CACHE_TAG_BILL_DUES_ALL);
}

export async function revalidateSubscriptions() {
  revalidateTag(CACHE_TAG_SUBSCRIPTIONS_ALL);
}

export async function revalidateSubscriptionDetails(subscriptionId: string) {
  revalidateTag(`${CACHE_TAG_SUBSCRIPTION_DETAILS}${subscriptionId}`);
}

export async function revalidateSubscriptionDetailsBillsDueGroupedByYear(subscriptionId: string) {
  revalidateTag(`${CACHE_TAG_SUBSCRIPTION_BILLS_GROUPED_BY_YEAR}${subscriptionId}`);
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

  try {
    let subscriptions: SubscriptionWithBillDues[] = await prisma.subscription.findMany({
      include: {
        billDues: {
          include: {
            subscription: true,
          },
        },
      },
      where: whereClause.AND.length > 0 ? whereClause : {},
    });
    // add the billDuesCurrentYearTotalCost to the subscriptions
    subscriptions = subscriptions.map((subscription) => {
      const billDuesCurrentYearCount = subscription.billDues.filter((billDue) => {
        return (
          DateTime.fromMillis(Number.parseInt(billDue.dueDate)).setZone(EST_TIME_ZONE).year === DateTime.now().setZone(EST_TIME_ZONE).year
        );
      }).length;

      const billDuesCurrentYearTotalCost = subscription.billDues
        .filter((billDue) => {
          return (
            DateTime.fromMillis(Number.parseInt(billDue.dueDate)).setZone(EST_TIME_ZONE).year === DateTime.now().setZone(EST_TIME_ZONE).year
          );
        })
        .reduce((acc, billDue) => acc + Number.parseFloat(`${billDue.cost ?? 0}`), 0);

      return { ...subscription, billDuesCurrentYearCount, billDuesCurrentYearTotalCost };
    });

    // sort the bill dues
    if (sortData) {
      subscriptions = getSortedSubscriptions(subscriptions, sortData);
    }

    const pageSize: number = paginationData?.pageSize ?? DEFAULT_PAGE_SIZE;
    const totalPages: number = Math.ceil(subscriptions.length / pageSize);
    // page starts at 1
    const pageNumber: number =
      searchParams?.page && isNumeric(searchParams?.page) && Number.parseInt(`${searchParams?.page}`) > 0 ?
        Number.parseInt(`${searchParams?.page}`)
      : 1;

    const startIndex: number = (pageNumber - 1) * pageSize;
    // if we are on the last page, the end index should be the total number of bills
    const endIndex: number = pageNumber === totalPages ? subscriptions.length : startIndex + pageSize;
    let subscriptionsToReturn: SubscriptionWithBillDues[] = subscriptions.slice(startIndex, endIndex);

    return {
      subscriptions: subscriptionsToReturn,
      sortData,
      totalPages,
      totalSubscriptionsCount: subscriptions.length,
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

async function getAllSubscriptionsWithBillDues(): Promise<SubscriptionWithBillDues[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_SUBSCRIPTIONS_ALL);

  try {
    const subscriptions: SubscriptionWithBillDues[] = await prisma.subscription.findMany({
      include: {
        billDues: {
          include: {
            subscription: true,
          },
        },
      },
    });

    return subscriptions;
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
    const subscription: SubscriptionWithBillDues | null = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        billDues: {
          include: {
            subscription: true,
          },
        },
      },
    });

    return subscription;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getSubscriptionWithBillDuesById(): ', JSON.stringify(error));
    throw new Error(`Error retrieving subscription by id. Code: ${error.code}`);
  }
}

export async function getSubscriptionWithBillDuesByIdUncached(subscriptionId: string): Promise<SubscriptionWithBillDues | null> {
  try {
    const subscription: SubscriptionWithBillDues | null = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        billDues: {
          include: {
            subscription: true,
          },
        },
      },
    });

    return subscription;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getSubscriptionWithBillDuesById(): ', JSON.stringify(error));
    throw new Error(`Error retrieving subscription by id. Code: ${error.code}`);
  }
}

export async function getSubscriptionBillsGroupedByYearById(subscriptionId: string): Promise<BillsDueGroupedByYearObject[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(`${CACHE_TAG_SUBSCRIPTION_BILLS_GROUPED_BY_YEAR}${subscriptionId}`);

  try {
    const subscription: SubscriptionWithBillDues | null = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        billDues: {
          include: {
            subscription: true,
          },
        },
      },
    });

    const billDues: BillDueWithSubscription[] = subscription?.billDues ?? [];

    const billDuesGroupedByYear: BillDueGroupedByYear = billDues.reduce((acc, billDue) => {
      const billDueDateLuxon = DateTime.fromMillis(Number.parseInt(billDue.dueDate)).setZone(EST_TIME_ZONE);
      const { year } = billDueDateLuxon;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(billDue);
      return acc;
    }, {} as BillDueGroupedByYear);

    const billsDueGroupedByYear: BillsDueGroupedByYearObject[] = Object.entries(billDuesGroupedByYear).map(([year, bills]) => ({
      year: year,
      bills: bills.toSorted((a, b) => {
        return Number.parseInt(a.dueDate) < Number.parseInt(b.dueDate) ? 1 : -1;
      }),
    }));

    const sortedBillsDueGroupedByYear: BillsDueGroupedByYearObject[] = billsDueGroupedByYear.sort((a, b) => {
      return Number.parseInt(a.year) < Number.parseInt(b.year) ? 1 : -1;
    });

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
  // delay 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    const subscription: SubscriptionWithBillDues = await prisma.subscription.update({
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
        billDues: {
          include: {
            subscription: true,
          },
        },
      },
    });

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
    const subscriptions: SubscriptionOriginal[] = await prisma.subscription.findMany();

    return subscriptions.length;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getAllSubscriptionsCount(): ', JSON.stringify(error));
    throw new Error(`Error retrieving subscriptions count. Code: ${error.code}`);
  }
}

export async function updateIsSubscriptionApproved(subscriptionId: string, isApproved: boolean): Promise<SubscriptionWithBillDues> {
  try {
    const subscription: SubscriptionWithBillDues = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { approved: isApproved },
      include: {
        billDues: {
          include: {
            subscription: true,
          },
        },
      },
    });

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
    const subscription: SubscriptionWithBillDues = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { signed: isSigned },
      include: {
        billDues: {
          include: {
            subscription: true,
          },
        },
      },
    });

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
    const subscription: SubscriptionWithBillDues = await prisma.subscription.create({
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
        billDues: {
          include: {
            subscription: true,
          },
        },
      },
    });

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
  // delay 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    const subscription: SubscriptionWithBillDues = await prisma.subscription.delete({
      where: { id: subscriptionId },
      include: {
        billDues: {
          include: {
            subscription: true,
          },
        },
      },
    });

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
