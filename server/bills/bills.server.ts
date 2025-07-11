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
import { CACHE_TAG_BILL_DUES_ALL } from '@/constants/constants';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { billEditableSchema, billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { BillDue, BillDueWithSubscription, BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';

import {
  getSortedBillDues,
  getFilteredBillDuesByYear,
  getFilteredBillDuesByMonth,
  getFilteredBillDuesBySpecialYear,
  getFilteredBillDuesBySpecialYearAndMonth,
} from './bills.server.utils';

export async function revalidateBillDue() {
  revalidateTag(CACHE_TAG_BILL_DUES_ALL);
}

export const getAllBillsCached = cache(async (sortData: SortDataModel | null, searchParams?: z.infer<typeof billSearchParamsSchema>) => {
  const res = await getAllBills(sortData, searchParams);
  return res;
});

export const getAllBillsCountCached = cache(async () => {
  const res = await getAllBillsCount();
  return res;
});

export async function getAllBills(
  sortData: SortDataModel | null,
  searchParams?: z.infer<typeof billSearchParamsSchema>,
): Promise<BillDueWithSubscriptionAndSortData> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_BILL_DUES_ALL);

  const whereClause: any = {
    AND: [],
  };

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
    whereClause.AND.push({
      subscription: {
        billCycleDuration: searchParams.frequency,
      },
    });
  }

  if (searchParams?.paymentStatus && searchParams.paymentStatus.trim() !== '') {
    if (searchParams.paymentStatus === 'paid-only') {
      whereClause.AND.push({
        paid: true,
        reimbursed: false,
      });
    } else if (searchParams.paymentStatus === 'reimbursed-only') {
      whereClause.AND.push({
        reimbursed: true,
        paid: false,
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
      },
      where: whereClause,
    });

    // Due date related filters
    const yearParams: string | undefined = searchParams?.year;
    const monthParams: string | undefined = searchParams?.month;

    if ((yearParams && yearParams.trim() !== '') || (monthParams && monthParams.trim() !== '')) {
      const doesMonthExist: boolean = !!(monthParams && monthParams.trim() !== '');
      const doesYearExist: boolean = !!(yearParams && yearParams.trim() !== '');

      const isYearInt: boolean = isNumeric(yearParams);

      // both month and year are numbers
      if (isYearInt && doesMonthExist && doesYearExist && monthParams && yearParams) {
        billDues = getFilteredBillDuesByMonth(billDues, monthParams, yearParams);
      }
      // only year is a number
      else if (isYearInt && doesYearExist && yearParams) {
        billDues = getFilteredBillDuesByYear(billDues, yearParams);
      }
      // only month is selected, auto default year to current year
      else if (!doesYearExist && doesMonthExist && monthParams) {
        const currentYear: number = DateTime.now().setZone(EST_TIME_ZONE).year;
        billDues = getFilteredBillDuesByMonth(billDues, monthParams, currentYear.toString());
      }
      // if the year is special scenario
      else if (doesYearExist && !isYearInt && !doesMonthExist) {
        billDues = getFilteredBillDuesBySpecialYear(billDues, yearParams ?? '');
      }
      // if the year is special and month is selected
      else if (doesYearExist && !isYearInt && doesMonthExist) {
        billDues = getFilteredBillDuesBySpecialYearAndMonth(billDues, yearParams ?? '', monthParams ?? '');
      }
    }

    // sort the bill dues
    if (sortData) {
      billDues = getSortedBillDues(billDues, sortData);
    }

    return {
      billDues: billDues,
      sortData,
    };
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getAllBills(): ', JSON.stringify(error));
    throw new Error(`Error retrieving bill dues. Code: ${error.code}`);
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

export async function updateIsBillDuePaid(billDueId: string, isPaid: boolean): Promise<BillDue> {
  try {
    const billDue: BillDue = await prisma.billDue.update({
      where: { id: billDueId },
      data: { paid: isPaid },
    });

    revalidateBillDue();

    return billDue;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at updateIsBillDuePaid(): ', JSON.stringify(error));
    throw new Error(`Error updating bill due paid status. Code: ${error.code}`);
  }
}

export async function updateIsBillDueReimbursed(billDueId: string, isReimbursed: boolean): Promise<BillDue> {
  try {
    const billDue: BillDue = await prisma.billDue.update({
      where: { id: billDueId },
      data: { reimbursed: isReimbursed },
    });

    revalidateBillDue();

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

    revalidateBillDue();

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

    revalidateBillDue();

    return billDue;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at deleteBillDue(): ', JSON.stringify(error));
    throw new Error(`Error deleting bill due. Code: ${error.code}`);
  }
}
