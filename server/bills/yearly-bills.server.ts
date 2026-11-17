/* eslint-disable no-console */
'use server';

import { cache } from 'react';
import { DateTime } from 'luxon';
import { cacheTag, cacheLife } from 'next/cache';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

import prisma from '@/lib/prisma';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { CACHE_TAG_BILL_DUES_ALL } from '@/constants/constants';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { YearlyBillsData, YearlyBillsMonth } from '@/models/bills/yearly-bills.model';

import { getSortedBillDues } from './bills.server.utils';

export const getYearlyDueBillsCached = cache(async (year: number, sortData: SortDataModel | null) => {
  const res = await getYearlyDueBills(year, sortData);
  return res;
});

/**
 * All bills due in a year (EST), grouped by month, with per-month and running totals.
 */
export async function getYearlyDueBills(year: number, sortData: SortDataModel | null): Promise<YearlyBillsData> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_BILL_DUES_ALL);

  const startOfYear: DateTime = DateTime.fromObject({ year, month: 1, day: 1 }, { zone: EST_TIME_ZONE });
  const endOfYear: DateTime = startOfYear.endOf('year');

  try {
    // dueDate is an epoch-millis string. Every date from 2002 through 2286 has 13 digits, so a string range
    // compare matches the numeric one and can use the dueDate index (the year select starts at 2002).
    const billDuesInYear: BillDueWithSubscription[] = await prisma.billDue.findMany({
      where: {
        dueDate: {
          gte: `${startOfYear.toMillis()}`,
          lte: `${endOfYear.toMillis()}`,
        },
      },
      include: {
        subscription: true,
        favorites: true,
      },
      orderBy: { dueDate: 'asc' },
    });

    const sortedBillDues: BillDueWithSubscription[] = sortData ? getSortedBillDues(billDuesInYear, sortData) : billDuesInYear;

    let runningTotal: number = 0;
    const months: YearlyBillsMonth[] = Array.from({ length: 12 }, (_, index: number) => {
      const monthStart: DateTime = startOfYear.set({ month: index + 1 });
      const monthEnd: DateTime = monthStart.endOf('month');
      const startEpoch: number = monthStart.toMillis();
      const endEpoch: number = monthEnd.toMillis();

      const billDues: BillDueWithSubscription[] = sortedBillDues
        .filter((billDue: BillDueWithSubscription) => {
          const dueDateEpoch: number = Number.parseInt(billDue.dueDate);
          return dueDateEpoch >= startEpoch && dueDateEpoch <= endEpoch;
        })
        .map(withEstDates);

      const totalDue: number = billDues.reduce((acc: number, billDue: BillDueWithSubscription) => acc + getBillDueCost(billDue), 0);
      runningTotal += totalDue;

      return {
        month: index + 1,
        monthName: monthStart.toFormat('MMMM'),
        billDues,
        totalDue,
        totalDueToDate: runningTotal,
        billsCount: billDues.length,
        subscriptionsCount: new Set(billDues.map((billDue: BillDueWithSubscription) => billDue.subscriptionId)).size,
        startDateEpoch: startEpoch,
        endDateEpoch: endEpoch,
      };
    });

    return {
      year,
      months,
      totalDue: runningTotal,
      billsCount: billDuesInYear.length,
      subscriptionsCount: new Set(billDuesInYear.map((billDue: BillDueWithSubscription) => billDue.subscriptionId)).size,
      sortData,
    };
  } catch (error: unknown) {
    console.error('Server error at getYearlyDueBills(): ', error);
    throw new Error(`Error retrieving due bills for ${year}.`);
  }
}

function getBillDueCost(billDue: BillDueWithSubscription): number {
  const cost: number = Number.parseFloat(`${billDue.cost ?? billDue.subscription.cost ?? 0}`);
  return Number.isFinite(cost) ? cost : 0;
}

// Same EST display fields the other bills tables get from getAllBills().
function withEstDates(billDue: BillDueWithSubscription): BillDueWithSubscription {
  const dueDate: DateTime = DateTime.fromMillis(Number.parseInt(billDue.dueDate), { zone: EST_TIME_ZONE });
  const dateAdded: DateTime = DateTime.fromJSDate(new Date(`${billDue.dateAdded}`)).setZone(EST_TIME_ZONE);
  const updatedAt: DateTime | null = billDue.updatedAt ? DateTime.fromJSDate(new Date(`${billDue.updatedAt}`)).setZone(EST_TIME_ZONE) : null;

  return {
    ...billDue,
    dueDateInEst: dueDate.toLocaleString(DateTime.DATETIME_SHORT),
    dateAddedInEst: dateAdded.toLocaleString(DateTime.DATETIME_SHORT),
    dateAddedInEstRelative: formatDistanceToNow(dateAdded.toJSDate(), { addSuffix: true }),
    updatedAtInEst: updatedAt?.toLocaleString(DateTime.DATETIME_SHORT),
    updatedAtInEstRelative: updatedAt ? formatDistanceToNow(updatedAt.toJSDate(), { addSuffix: true }) : undefined,
  };
}
