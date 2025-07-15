'use server';

import { cache } from 'react';
// eslint-disable-next-line no-unused-vars
import { Prisma } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { unstable_cacheLife as cacheLife } from 'next/cache';

import prisma from '@/lib/prisma';
import { CACHE_TAG_PAGINATION_DATA_PREFIX } from '@/constants/constants';
import { PaginationDataModel, PaginationDataUpsertable } from '@/models/pagination-data/pagination-data.model';

export async function revalidatePaginationForPage(pageId: string) {
  revalidateTag(`${CACHE_TAG_PAGINATION_DATA_PREFIX}${pageId}`);
}

export const getPaginationDataForPageIdCached = cache(async (pageId: string) => {
  const res = await getPaginationDataForPageId(pageId);
  return res;
});

export async function getPaginationDataForPageId(pageId: string): Promise<PaginationDataModel | null> {
  'use cache';
  cacheLife('weeks');
  cacheTag(`${CACHE_TAG_PAGINATION_DATA_PREFIX}${pageId}`);

  try {
    const paginationData = await prisma.paginationData.findFirst({
      where: {
        pageId,
      },
    });

    if (!paginationData) {
      const newPaginationData = await prisma.paginationData.create({
        data: {
          pageId,
          pageNumber: 1,
          pageSize: 10,
        },
      });

      return newPaginationData;
    }

    return paginationData;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getPaginationDataForPageId(): ', JSON.stringify(error));
    throw new Error(`Error retrieving pagination data for page id: ${pageId}. Code: ${error.code}`);
  }
}

export async function upsertPaginationData(paginationData: PaginationDataUpsertable): Promise<PaginationDataModel> {
  if (paginationData.id && paginationData.id !== '') {
    try {
      const updatedPaginationData = await prisma.paginationData.update({
        where: { id: paginationData.id },
        data: {
          pageSize: paginationData.pageSize,
        },
      });

      revalidateTag(`${CACHE_TAG_PAGINATION_DATA_PREFIX}${paginationData.pageId}`);

      return updatedPaginationData;
    } catch (error: Prisma.PrismaClientKnownRequestError | any) {
      console.error('Server error at updating pagination data(): ', JSON.stringify(error));
      throw new Error(`Error updating pagination data. Code: ${error.code}`);
    }
  } else {
    // create new pagination data
    try {
      const newPaginationData = await prisma.paginationData.create({
        data: paginationData,
      });

      revalidateTag(`${CACHE_TAG_PAGINATION_DATA_PREFIX}${paginationData.pageId}`);

      return newPaginationData;
    } catch (error: Prisma.PrismaClientKnownRequestError | any) {
      console.error('Server error at adding pagination data(): ', JSON.stringify(error));
      throw new Error(`Error creating pagination data. Code: ${error.code}`);
    }
  }
}
