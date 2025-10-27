'use server';

import z from 'zod';
import { cache } from 'react';
import { cacheTag } from 'next/cache';
import { updateTag } from 'next/cache';
import { cacheLife } from 'next/cache';
// eslint-disable-next-line no-unused-vars
import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';
import { BillDue } from '@/models/bills/bills.model';
import { SubscriptionOriginal } from '@/models/subscriptions/subscriptions.model';
import {
  FavoriteEntity,
  FavoriteActionType,
  FavoriteEntityResponse,
  FavoriteEntityEntityTypeType,
} from '@/models/favorites/favorite.model';
import {
  CACHE_TAG_BILL_DUES_ALL,
  CACHE_TAG_FAVORITES_ALL,
  CACHE_TAG_FAVORITES_PREFIX,
  CACHE_TAG_SUBSCRIPTIONS_ALL,
} from '@/constants/constants';

export async function revalidateIsFavoriteByEntityTypeAndId(entityType: FavoriteEntityEntityTypeType, id: string) {
  updateTag(`${CACHE_TAG_FAVORITES_PREFIX}${entityType}-${id}`);
}

export const getIsFavoriteByEntityTypeAndIdCached = cache(async (entityType: FavoriteEntityEntityTypeType, id: string) => {
  const res = await getIsFavoriteByEntityTypeAndId(entityType, id);
  return res;
});

export const getAllFavoritesCached = cache(async (): Promise<FavoriteEntity[]> => {
  const res = await getAllFavoritesEntities();
  return res;
});

export async function getAllFavoritesEntities(): Promise<FavoriteEntity[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_FAVORITES_ALL);

  try {
    const favorites: FavoriteEntity[] = await prisma.favoriteEntity.findMany();
    const sortedFavorites: FavoriteEntity[] = favorites.sort((a: FavoriteEntity, b: FavoriteEntity) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      return aName > bName ? 1 : -1;
    });

    const withUrl = sortedFavorites.map((favorite) => {
      let favUrl = favorite.url ?? '';
      if (favorite.entityType === 'SUBSCRIPTION') {
        favUrl = `/subscriptions/${favorite.subscriptionId}`;
      } else if (favorite.entityType === 'BILL_DUE') {
        favUrl = `/bills/${favorite.billDueId}`;
      }

      return {
        ...favorite,
        url: favUrl,
      };
    });

    return withUrl;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getAllFavorites(): ', JSON.stringify(error));
    throw new Error(`Error retrieving favorites. Code: ${error.code}`);
  }
}

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

export async function toggleFavoriteByBillDueId(
  billDueId: string,
  name: string,
  status: FavoriteActionType,
  favoriteEntityId?: string,
): Promise<z.infer<typeof FavoriteEntityResponse> | undefined> {
  // delay for 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    if (status === 'CREATE') {
      const res = await prisma.favoriteEntity.create({
        data: {
          billDueId,
          entityType: 'BILL_DUE',
          name,
        },
      });

      revalidateIsFavoriteByEntityTypeAndId('BILL_DUE', billDueId);
      updateTag(CACHE_TAG_BILL_DUES_ALL);
      return res;
    } else if (status === 'EDIT') {
      const res = await prisma.favoriteEntity.update({
        where: { id: favoriteEntityId },
        data: { name },
      });

      revalidateIsFavoriteByEntityTypeAndId('BILL_DUE', billDueId);
      updateTag(CACHE_TAG_BILL_DUES_ALL);
      return res;
    } else if (status === 'DELETE') {
      const res = await prisma.favoriteEntity.delete({
        where: { id: favoriteEntityId },
      });

      revalidateIsFavoriteByEntityTypeAndId('BILL_DUE', billDueId);
      updateTag(CACHE_TAG_BILL_DUES_ALL);
      return res;
    }
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at toggleFavoriteByBillDueId(): ', JSON.stringify(error));
    throw new Error(`Error updating favorite entity. Code: ${error.code}`);
  }
}

export async function getEntityByFavoriteTypeId(entity: FavoriteEntity): Promise<SubscriptionOriginal | BillDue | null> {
  try {
    if (entity.entityType === 'SUBSCRIPTION' && entity.subscriptionId) {
      const subscription: SubscriptionOriginal | null = await prisma.subscription.findUnique({
        where: { id: entity.subscriptionId },
      });
      return subscription;
    } else if (entity.entityType === 'BILL_DUE' && entity.billDueId) {
      const billDue: BillDue | null = await prisma.billDue.findUnique({
        where: { id: entity.billDueId },
      });
      return billDue;
    }
    return null;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getFavoriteById(): ', JSON.stringify(error));
    throw new Error(`Error retrieving favorite by id. Code: ${error.code}`);
  }
}
