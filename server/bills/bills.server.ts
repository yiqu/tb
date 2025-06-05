/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
'use server';

import { Prisma } from '@prisma/client';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { unstable_cacheLife as cacheLife } from 'next/cache';

import prisma from '@/lib/prisma';
import { CACHE_TAG_BILL_DUES_ALL } from '@/constants/constants';
import { BillDue, BillDueWithSubscription } from '@/models/bills/bills.model';

export async function getAllBills(): Promise<BillDueWithSubscription[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_BILL_DUES_ALL);

  try {
    console.log('getAllBills() function called');
    const billDues = await prisma.billDue.findMany({
      include: {
        subscription: true,
      },
    });

    const sortedByDueDate = billDues.sort((a: BillDue, b: BillDue) => {
      return Number.parseInt(a.dueDate) > Number.parseInt(b.dueDate) ? 1 : -1;
    });

    return sortedByDueDate;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getAllBills(): ', JSON.stringify(error));
    throw new Error(`Error retrieving bill dues. Code: ${error.code}`);
  }
}
