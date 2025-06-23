/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
'use server';

import z from 'zod';
import { cache } from 'react';
import { Prisma } from '@prisma/client';
import { unstable_cacheLife as cacheLife } from 'next/cache';
import { revalidateTag, unstable_cacheTag as cacheTag } from 'next/cache';

import prisma from '@/lib/prisma';
import { CACHE_TAG_BILL_DUES_ALL } from '@/constants/constants';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { billEditableSchema } from '@/validators/bills/bill.schema';
import { BillDue, BillDueWithSubscription, BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';

export async function revalidateBillDue() {
  revalidateTag(CACHE_TAG_BILL_DUES_ALL);
}

export const getAllBillsCached = cache(async (sortData: SortDataModel | null) => {
  const res = await getAllBills(sortData);
  return res;
});

export async function getAllBills(sortData: SortDataModel | null): Promise<BillDueWithSubscriptionAndSortData> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_BILL_DUES_ALL);

  try {
    const billDues: BillDueWithSubscription[] = await prisma.billDue.findMany({
      include: {
        subscription: true,
      },
    });

    const sortedByDueDate: BillDueWithSubscription[] = billDues.sort((a: BillDueWithSubscription, b: BillDueWithSubscription) => {
      if (sortData?.sortField) {
        if (sortData.sortField === 'dueDate') {
          if (sortData.sortDirection === 'asc') {
            return Number.parseInt(a.dueDate) > Number.parseInt(b.dueDate) ? 1 : -1;
          } else if (sortData.sortDirection === 'desc') {
            return Number.parseInt(a.dueDate) < Number.parseInt(b.dueDate) ? 1 : -1;
          }
          return 0;
        }
        if (sortData.sortField === 'dateAdded') {
          if (sortData.sortDirection === 'asc') {
            return a.dateAdded.getTime() > b.dateAdded.getTime() ? 1 : -1;
          } else if (sortData.sortDirection === 'desc') {
            return a.dateAdded.getTime() < b.dateAdded.getTime() ? 1 : -1;
          }
        }
        if (sortData.sortField === 'updatedAt') {
          if (sortData.sortDirection === 'asc') {
            return (a.updatedAt ? a.updatedAt.getTime() : 0) > (b.updatedAt ? b.updatedAt.getTime() : 0) ? 1 : -1;
          } else if (sortData.sortDirection === 'desc') {
            return (a.updatedAt ? a.updatedAt.getTime() : 0) < (b.updatedAt ? b.updatedAt.getTime() : 0) ? 1 : -1;
          }
        }
        if (sortData.sortField === 'subscription') {
          if (sortData.sortDirection === 'asc') {
            return a.subscription.name.toLowerCase() > b.subscription.name.toLowerCase() ? 1 : -1;
          } else if (sortData.sortDirection === 'desc') {
            return a.subscription.name.toLowerCase() < b.subscription.name.toLowerCase() ? 1 : -1;
          }
        }

        if (sortData.sortField === 'cost') {
          const aCost = a.cost ?? a.subscription.cost;
          const bCost = b.cost ?? b.subscription.cost;
          if (sortData.sortDirection === 'asc') {
            return aCost > bCost ? 1 : -1;
          } else if (sortData.sortDirection === 'desc') {
            return aCost < bCost ? 1 : -1;
          }
        }

        if (sortData.sortField === 'paid') {
          if (sortData.sortDirection === 'asc') {
            return a.paid > b.paid ? 1 : -1;
          } else if (sortData.sortDirection === 'desc') {
            return a.paid < b.paid ? 1 : -1;
          }
        }

        if (sortData.sortField === 'reimbursed') {
          if (sortData.sortDirection === 'asc') {
            return a.reimbursed > b.reimbursed ? 1 : -1;
          } else if (sortData.sortDirection === 'desc') {
            return a.reimbursed < b.reimbursed ? 1 : -1;
          }
        }

        return a[sortData.sortField] > b[sortData.sortField] ? 1 : -1;
      }

      return 0;
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
