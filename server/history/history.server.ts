'use server';

import { cache } from 'react';
import { DateTime } from 'luxon';
// eslint-disable-next-line no-unused-vars
import { Prisma } from '@prisma/client';
import { cacheLife, updateTag } from 'next/cache';
import { cacheTag, revalidateTag } from 'next/cache';

import prisma from '@/lib/prisma';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { CACHE_TAG_HISTORY_ENTRIES_ALL } from '@/constants/constants';
import { HistoryEntry, HistoryEntryGroup, HistoryEntryResponse, SORTING_ORDER_HISTORY_ENTRIES } from '@/models/history/history-entry.model';

import { createInitialHistoryEntryGroups } from './history.utils';

export async function revalidateHistoryEntriesAll() {
  updateTag(CACHE_TAG_HISTORY_ENTRIES_ALL);
}

export const getAllHistoryEntriesCached = cache(async (): Promise<HistoryEntryResponse> => {
  const res = await getAllHistoryEntries();
  return res;
});

export async function getAllHistoryEntries(): Promise<HistoryEntryResponse> {
  'use cache';
  cacheLife('minutes');
  cacheTag(CACHE_TAG_HISTORY_ENTRIES_ALL);

  try {
    const historyEntries: HistoryEntry[] = await prisma.historyEntity.findMany({
      orderBy: {
        dateAdded: 'desc',
      },
    });

    // group the history by 5 groups.
    // Today, yesterday, last 7 days, last 30 days, older

    const todayLuxon = DateTime.now().setZone(EST_TIME_ZONE);
    const todayRangeTuple = [todayLuxon.startOf('day').toMillis(), todayLuxon.endOf('day').toMillis()];
    const yesterdayLuxonTuple = [
      todayLuxon.minus({ days: 1 }).startOf('day').toMillis(),
      todayLuxon.minus({ days: 1 }).endOf('day').toMillis(),
    ];
    const last7DaysLuxonTuple = [todayLuxon.minus({ days: 7 }).startOf('day').toMillis(), todayLuxon.endOf('day').toMillis()];
    const last30DaysLuxonTuple = [todayLuxon.minus({ days: 30 }).startOf('day').toMillis(), todayLuxon.endOf('day').toMillis()];

    let groups: HistoryEntryGroup[] = createInitialHistoryEntryGroups();

    for (const historyEntry of historyEntries) {
      const entryTime = historyEntry.dateAdded.getTime();

      // older than 30 days
      if (entryTime < last30DaysLuxonTuple[0]) {
        groups[4].historyEntries.push(historyEntry);
      }
      // last 30 days (between 30 days ago and 7 days ago)
      else if (entryTime < last7DaysLuxonTuple[0]) {
        groups[3].historyEntries.push(historyEntry);
      }
      // last 7 days (between 7 days ago and yesterday)
      else if (entryTime < yesterdayLuxonTuple[0]) {
        groups[2].historyEntries.push(historyEntry);
      }
      // yesterday
      else if (entryTime < todayRangeTuple[0]) {
        groups[1].historyEntries.push(historyEntry);
      }
      // today
      else {
        groups[0].historyEntries.push(historyEntry);
      }
    }

    // sort the groups by today, yesterday, last 7 days, last 30 days, older.
    // sorting
    groups = groups.toSorted((a, b) => {
      return SORTING_ORDER_HISTORY_ENTRIES[a.dateLabel] - SORTING_ORDER_HISTORY_ENTRIES[b.dateLabel];
    });

    return {
      groups,
      totalCount: historyEntries.length,
    };
  } catch (error: unknown) {
    console.error('Server error at getAllHistoryEntriesCached(): ', JSON.stringify(error));
    const errorCode = error instanceof Prisma.PrismaClientKnownRequestError ? error.code : 'UNKNOWN';
    throw new Error(`Error retrieving history entries. Code: ${errorCode}`);
  }
}

export async function addHistoryEntry(name: string | null, url: string): Promise<HistoryEntry> {
  try {
    const historyEntry: HistoryEntry = await prisma.historyEntity.create({
      data: { name, url },
    });

    revalidateTag(CACHE_TAG_HISTORY_ENTRIES_ALL, 'max');

    return historyEntry;
  } catch (error: unknown) {
    console.error('Server error at addHistoryEntryCached(): ', JSON.stringify(error));
    const errorCode = error instanceof Prisma.PrismaClientKnownRequestError ? error.code : 'UNKNOWN';
    throw new Error(`Error adding history entry. Code: ${errorCode}`);
  }
}
