/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
'use server';

import { cache } from 'react';
import { Prisma } from '@prisma/client';
import { unstable_cacheLife as cacheLife } from 'next/cache';
import { revalidateTag, unstable_cacheTag as cacheTag } from 'next/cache';

import prisma from '@/lib/prisma';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { CACHE_TAG_SUBSCRIPTIONS_ALL } from '@/constants/constants';
import { SubscriptionOriginal } from '@/models/subscriptions/subscriptions.model';
import { BillDue, BillDueWithSubscription, BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';

export async function revalidateSubscriptions() {
  revalidateTag(CACHE_TAG_SUBSCRIPTIONS_ALL);
}

export const getAllSubscriptionsCached = cache(async () => {
  const res = await getAllSubscriptions();
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
