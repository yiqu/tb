'use server';

import { cache } from 'react';
import { cacheTag } from 'next/cache';
import { updateTag } from 'next/cache';
import { cacheLife } from 'next/cache';
// eslint-disable-next-line no-unused-vars
import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';
import { SortDataModel, SortDataUpsertable } from '@/models/sort-data/SortData.model';
import { CACHE_TAG_BILL_DUES_ALL, CACHE_TAG_SORT_DATA_PREFIX, CACHE_TAG_SUBSCRIPTIONS_ALL } from '@/constants/constants';

export const getSortDataForPageIdCached = cache(async (pageId: string) => {
  const res = await getSortDataForPageId(pageId);
  return res;
});

export async function getSortDataForPageId(pageId: string): Promise<SortDataModel | null> {
  'use cache';
  cacheLife('weeks');
  cacheTag(`${CACHE_TAG_SORT_DATA_PREFIX}${pageId}`);

  try {
    const sortData = await prisma.sortData.findFirst({
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
  if (sortData.id && sortData.id !== '') {
    try {
      const updatedSortData = await prisma.sortData.update({
        where: { id: sortData.id },
        data: {
          sortDirection: sortData.sortDirection,
          sortField: sortData.sortField,
        },
      });

      updateTag(`${CACHE_TAG_SORT_DATA_PREFIX}${sortData.pageId}`);
      updateTag(CACHE_TAG_BILL_DUES_ALL);
      updateTag(CACHE_TAG_SUBSCRIPTIONS_ALL);

      return updatedSortData;
    } catch (error: Prisma.PrismaClientKnownRequestError | any) {
      console.error('Server error at updating sort data(): ', JSON.stringify(error));
      throw new Error(`Error updating sort data. Code: ${error.code}`);
    }
  } else {
    // create new sort data
    try {
      const newSortData = await prisma.sortData.create({
        data: sortData,
      });

      updateTag(`${CACHE_TAG_SORT_DATA_PREFIX}${sortData.pageId}`);
      updateTag(CACHE_TAG_BILL_DUES_ALL);
      updateTag(CACHE_TAG_SUBSCRIPTIONS_ALL);

      return newSortData;
    } catch (error: Prisma.PrismaClientKnownRequestError | any) {
      console.error('Server error at adding sort data(): ', JSON.stringify(error));
      throw new Error(`Error creating sort data. Code: ${error.code}`);
    }
  }
}
