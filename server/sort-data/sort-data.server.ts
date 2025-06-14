'use server';

import { cache } from 'react';
// eslint-disable-next-line no-unused-vars
import { Prisma } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { unstable_cacheLife as cacheLife } from 'next/cache';

import prisma from '@/lib/prisma';
import { CACHE_TAG_SORT_DATA_PREFIX } from '@/constants/constants';
import { SortDataModel, SortDataAddable, SortDataEditable, SortDataUpsertable } from '@/models/sort-data/SortData.model';

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

      revalidateTag(`${CACHE_TAG_SORT_DATA_PREFIX}${sortData.pageId}`);

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

      revalidateTag(`${CACHE_TAG_SORT_DATA_PREFIX}${sortData.pageId}`);

      return newSortData;
    } catch (error: Prisma.PrismaClientKnownRequestError | any) {
      console.error('Server error at adding sort data(): ', JSON.stringify(error));
      throw new Error(`Error creating sort data. Code: ${error.code}`);
    }
  }
}

export async function upsertSortData(sortData: SortDataAddable | SortDataEditable): Promise<SortDataModel> {
  if ('id' in sortData) {
    try {
      const updatedSortData = await prisma.sortData.upsert({
        where: { id: sortData.id },
        update: sortData,
        create: sortData,
      });

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

      return newSortData;
    } catch (error: Prisma.PrismaClientKnownRequestError | any) {
      console.error('Server error at adding sort data(): ', JSON.stringify(error));
      throw new Error(`Error creating sort data. Code: ${error.code}`);
    }
  }
}
