'use server';

import { cache } from 'react';
import { cacheTag } from 'next/cache';
import { updateTag } from 'next/cache';
import { cacheLife } from 'next/cache';
import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';
import { SortDataModel, SortDataUpsertable } from '@/models/sort-data/SortData.model';
import {
  CACHE_TAG_BILL_DUES_ALL,
  CACHE_TAG_SORT_DATA_PREFIX,
  CACHE_TAG_SUBSCRIPTIONS_ALL,
  CACHE_TAG_BILL_DUES_CURRENT_MONTH,
} from '@/constants/constants';

export const getSortDataForPageIdCached = cache(async (pageId: string) => {
  const res = await getSortDataForPageId(pageId);
  return res;
});

export async function getSortDataForPageId(pageId: string): Promise<SortDataModel | null> {
  'use cache';
  cacheLife('weeks');
  cacheTag(`${CACHE_TAG_SORT_DATA_PREFIX}${pageId}`);

  try {
    const sortData = await prisma.sortData.findUnique({
      where: {
        pageId,
      },
    });

    return sortData;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getSortDataForPageId(): ', JSON.stringify(error));
    throw new Error(`Error retrieving sort data for page id: ${pageId}. Code: ${error.code}`);
  }
}

export async function upsertSortData2(sortData: SortDataUpsertable): Promise<SortDataModel> {
  // pageId is unique, so every write targets the page's one record (any client-sent id is ignored).
  const { pageId, sortDirection, sortField } = sortData;

  let savedSortData: SortDataModel;
  try {
    savedSortData = await prisma.sortData.upsert({
      where: { pageId },
      update: { sortDirection, sortField },
      create: { pageId, sortDirection, sortField },
    });
  } catch (error: unknown) {
    // Two first-time clicks can race to create the record: the loser hits the unique index (P2002), so update the winner's record.
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
      console.error('Server error at upserting sort data(): ', JSON.stringify(error));
      throw new Error(`Error saving sort data for page id: ${pageId}.`);
    }

    try {
      savedSortData = await prisma.sortData.update({
        where: { pageId },
        data: { sortDirection, sortField },
      });
    } catch (retryError: unknown) {
      console.error('Server error at updating sort data(): ', JSON.stringify(retryError));
      throw new Error(`Error saving sort data for page id: ${pageId}.`);
    }
  }

  updateTag(`${CACHE_TAG_SORT_DATA_PREFIX}${pageId}`);
  updateTag(CACHE_TAG_BILL_DUES_ALL);
  updateTag(CACHE_TAG_BILL_DUES_CURRENT_MONTH);
  updateTag(CACHE_TAG_SUBSCRIPTIONS_ALL);

  return savedSortData;
}
