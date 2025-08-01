/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
'use server';

import { cache } from 'react';
import { DateTime } from 'luxon';
import { Prisma } from '@prisma/client';
import { unstable_cacheLife as cacheLife } from 'next/cache';
import { revalidateTag, unstable_cacheTag as cacheTag } from 'next/cache';

import prisma from '@/lib/prisma';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { SubscriptionOriginal, SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { BillDue, BillDueGroupedByYear, BillDueWithSubscription, BillsDueGroupedByYearObject } from '@/models/bills/bills.model';
import {
  CACHE_TAG_SUBSCRIPTIONS_ALL,
  CACHE_TAG_SUBSCRIPTION_DETAILS,
  CACHE_TAG_SUBSCRIPTION_BILLS_GROUPED_BY_YEAR,
} from '@/constants/constants';

export async function revalidateSubscriptions() {
  revalidateTag(CACHE_TAG_SUBSCRIPTIONS_ALL);
}

export const getAllSubscriptionsCached = cache(async () => {
  const res = await getAllSubscriptions();
  return res;
});

export const getAllSubscriptionsWithBillDuesCached = cache(async () => {
  const res = await getAllSubscriptionsWithBillDues();
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
