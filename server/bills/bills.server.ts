/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
'use server';

import { Prisma } from '@prisma/client';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { unstable_cacheLife as cacheLife } from 'next/cache';

import prisma from '@/lib/prisma';
import { CACHE_TAG_BILL_DUES_ALL } from '@/constants/constants';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { BillDue, BillDueWithSubscription, BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';

import { getSortDataForPageId } from '../sort-data/sort-data.server';

export async function getAllBills(pageId: string, sortData: SortDataModel | null): Promise<BillDueWithSubscriptionAndSortData> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_BILL_DUES_ALL);

  try {
    const billDues: BillDueWithSubscription[] = await prisma.billDue.findMany({
      include: {
        subscription: true,
      },
    });

    const sortedByDueDate: BillDueWithSubscription[] = billDues.sort((a: BillDue, b: BillDue) => {
      return Number.parseInt(a.dueDate) > Number.parseInt(b.dueDate) ? 1 : -1;
    });

    return {
      billDues: sortedByDueDate,
      sortData,
    };
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getAllBills(): ', JSON.stringify(error));
    throw new Error(`Error retrieving bill dues. Code: ${error.code}`);
  }
}
