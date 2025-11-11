/* eslint-disable no-console */
'use server';

import z from 'zod';
import { cache } from 'react';
import { DateTime } from 'luxon';
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
import { BillDue, BillDueWithSubscription, BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';
import { billAddableSchema, billEditableSchema, billSearchParamsSchema, AutoSelectedDefaultStatus } from '@/validators/bills/bill.schema';
import {
  DEFAULT_PAGE_SIZE,
  SORT_DATA_PAGE_IDS,
  CACHE_TAG_BILL_DUES_ALL,
  CACHE_TAG_SUBSCRIPTIONS_ALL,
  CACHE_TAG_SUBSCRIPTION_DETAILS,
  CACHE_TAG_PAGINATION_DATA_PREFIX,
  CACHE_TAG_BILL_DUES_CURRENT_MONTH,
  CACHE_TAG_SUBSCRIPTION_BILLS_GROUPED_BY_YEAR,
} from '@/constants/constants';

export async function revalidateBillsForCurrentMonth() {
  updateTag(CACHE_TAG_BILL_DUES_CURRENT_MONTH);
}

export const getBillsForCurrentMonthCached = cache(async () => {
  const res = await getBillsForCurrentMonth();
  return res;
});

async function getBillsForCurrentMonth(): Promise<BillDueWithSubscription[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_BILL_DUES_CURRENT_MONTH);

  const currentDateLuxon = DateTime.now().setZone(EST_TIME_ZONE);
  const currentMonthStartLuxon = currentDateLuxon.startOf('month');
  const endOfMonthLuxon = currentDateLuxon.endOf('month');

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

    return currentMonthBillsDue;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getBillsForCurrentMonth(): ', JSON.stringify(error));
    throw new Error(`Error getting bills for current month. Code: ${error.code}`);
  }
}
