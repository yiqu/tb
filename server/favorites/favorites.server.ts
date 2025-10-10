'use server';

import z from 'zod';
import { cache } from 'react';
import { updateTag } from 'next/cache';
// eslint-disable-next-line no-unused-vars
import { Prisma } from '@prisma/client';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { unstable_cacheLife as cacheLife } from 'next/cache';

import prisma from '@/lib/prisma';
import { CACHE_TAG_FAVORITES_PREFIX, CACHE_TAG_SUBSCRIPTIONS_ALL } from '@/constants/constants';
import { FavoriteActionType, FavoriteEntityResponse, FavoriteEntityEntityTypeType } from '@/models/favorites/favorite.model';

export async function revalidateIsFavoriteByEntityTypeAndId(entityType: FavoriteEntityEntityTypeType, id: string) {
  updateTag(`${CACHE_TAG_FAVORITES_PREFIX}${entityType}-${id}`);
}

export const getIsFavoriteByEntityTypeAndIdCached = cache(async (entityType: FavoriteEntityEntityTypeType, id: string) => {
  const res = await getIsFavoriteByEntityTypeAndId(entityType, id);
  return res;
});

export async function getIsFavoriteByEntityTypeAndId(
  entityType: FavoriteEntityEntityTypeType,
  id: string,
): Promise<z.infer<typeof FavoriteEntityResponse> | null> {
  'use cache';
  cacheLife('weeks');
  cacheTag(`${CACHE_TAG_FAVORITES_PREFIX}${entityType}-${id}`);

  let queryObject: any = {};

  if (entityType === 'SUBSCRIPTION') {
    queryObject = {
      subscriptionId: id,
    };
  } else {
    queryObject = {
      billDueId: id,
    };
  }

  try {
    const favoriteEntity = await prisma.favoriteEntity.findFirst({
      where: {
        ...queryObject,
      },
    });

    return favoriteEntity;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getIsFavoriteByEntityTypeAndId(): ', JSON.stringify(error));
    throw new Error(`Error retrieving is favorite by entity type and id: ${entityType} and ${id}. Code: ${error.code}`);
  }
}

export async function toggleFavoriteBySubscriptionId(
  subscriptionId: string,
  name: string,
  status: FavoriteActionType,
  favoriteEntityId?: string,
): Promise<z.infer<typeof FavoriteEntityResponse> | undefined> {
  // delay for 1 second
  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    if (status === 'CREATE') {
      const res = await prisma.favoriteEntity.create({
        data: {
          subscriptionId,
          entityType: 'SUBSCRIPTION',
          name,
        },
      });

      revalidateIsFavoriteByEntityTypeAndId('SUBSCRIPTION', subscriptionId);
      updateTag(CACHE_TAG_SUBSCRIPTIONS_ALL);
      return res;
    } else if (status === 'EDIT') {
      const res = await prisma.favoriteEntity.update({
        where: { id: favoriteEntityId },
        data: { name },
      });

      revalidateIsFavoriteByEntityTypeAndId('SUBSCRIPTION', subscriptionId);
      updateTag(CACHE_TAG_SUBSCRIPTIONS_ALL);
      return res;
    } else if (status === 'DELETE') {
      const res = await prisma.favoriteEntity.delete({
        where: { id: favoriteEntityId },
      });

      revalidateIsFavoriteByEntityTypeAndId('SUBSCRIPTION', subscriptionId);
      updateTag(CACHE_TAG_SUBSCRIPTIONS_ALL);
      return res;
    }
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at toggleFavoriteBySubscriptionId(): ', JSON.stringify(error));
    throw new Error(`Error updating favorite entity. Code: ${error.code}`);
  }
}
