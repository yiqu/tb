'use server';

import z from 'zod';
import { cache } from 'react';
import { DateTime } from 'luxon';
import { cacheTag } from 'next/cache';
import { updateTag } from 'next/cache';
import { cacheLife } from 'next/cache';
// eslint-disable-next-line no-unused-vars
import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { BillDueWithSubscription, BillDueWithSubscriptionOnly } from '@/models/bills/bills.model';
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

import { transformSubscriptionExtraProps, transformSubscriptionExtraPropsForFavorite } from '../subscriptions/utils';

export async function revalidateIsFavoriteByEntityTypeAndId(entityType: FavoriteEntityEntityTypeType, id: string) {
  updateTag(`${CACHE_TAG_FAVORITES_PREFIX}${entityType}-${id}`);
}

export async function revalidateFavoritesAll() {
  updateTag(CACHE_TAG_FAVORITES_ALL);
}

export const getIsFavoriteByEntityTypeAndIdCached = cache(async (entityType: FavoriteEntityEntityTypeType, id: string) => {
  const res = await getIsFavoriteByEntityTypeAndId(entityType, id);
  return res;
});

export const getAllFavoritesCached = cache(async (): Promise<FavoriteEntity[]> => {
  const res = await getAllFavoritesEntities();
  return res;
});

/**
 * Quick access - favorites list
 * @returns
 */
export async function getAllFavoritesEntities(): Promise<FavoriteEntity[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_FAVORITES_ALL);

  try {
    const favorites: FavoriteEntity[] = await prisma.favoriteEntity.findMany();
    const sortedFavorites: FavoriteEntity[] = favorites.toSorted((a: FavoriteEntity, b: FavoriteEntity) => {
      // sort by entity type first (BILL_DUE, then SEARCH_QUERY, then SUBSCRIPTION)
      if (a.entityType !== b.entityType) {
        const entityTypeOrder: Record<FavoriteEntityEntityTypeType, number> = {
          BILL_DUE: 0,
          SEARCH_QUERY: 1,
          SUBSCRIPTION: 2,
        };
        return entityTypeOrder[a.entityType] - entityTypeOrder[b.entityType];
      }

      // if entity type is SEARCH_QUERY, sort by date that is updated at descending
      if (a.entityType === 'SEARCH_QUERY' && b.entityType === 'SEARCH_QUERY') {
        return (a.updatedAt ?? 0) < (b.updatedAt ?? 0) ? -1 : 1;
      }

      // if entity type is BILL_DUE, sort by due date descending
      if (a.entityType === 'BILL_DUE' && b.entityType === 'BILL_DUE') {
        const favNameA = a.name.toLowerCase();
        const favNameB = b.name.toLowerCase();
        const dueDateA: string | undefined = favNameA.split(' - ')[1];
        const dueDateB: string | undefined = favNameB.split(' - ')[1];
        return Number.parseInt(dueDateA ?? '0') < Number.parseInt(dueDateB ?? '0') ? -1 : 1;
      }

      // Same entity type, sort alphabetically by name
      return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
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
      revalidateFavoritesAll();
      return res;
    } else if (status === 'EDIT') {
      const res = await prisma.favoriteEntity.update({
        where: { id: favoriteEntityId },
        data: { name },
      });
      revalidateIsFavoriteByEntityTypeAndId('SUBSCRIPTION', subscriptionId);
      updateTag(CACHE_TAG_SUBSCRIPTIONS_ALL);
      revalidateFavoritesAll();
      return res;
    } else if (status === 'DELETE') {
      const res = await prisma.favoriteEntity.delete({
        where: { id: favoriteEntityId },
      });
      revalidateIsFavoriteByEntityTypeAndId('SUBSCRIPTION', subscriptionId);
      updateTag(CACHE_TAG_SUBSCRIPTIONS_ALL);
      revalidateFavoritesAll();
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
      revalidateFavoritesAll();
      return res;
    } else if (status === 'EDIT') {
      const res = await prisma.favoriteEntity.update({
        where: { id: favoriteEntityId },
        data: { name },
      });

      revalidateIsFavoriteByEntityTypeAndId('BILL_DUE', billDueId);
      updateTag(CACHE_TAG_BILL_DUES_ALL);
      revalidateFavoritesAll();
      return res;
    } else if (status === 'DELETE') {
      const res = await prisma.favoriteEntity.delete({
        where: { id: favoriteEntityId },
      });

      revalidateIsFavoriteByEntityTypeAndId('BILL_DUE', billDueId);
      updateTag(CACHE_TAG_BILL_DUES_ALL);
      revalidateFavoritesAll();
      return res;
    }
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at toggleFavoriteByBillDueId(): ', JSON.stringify(error));
    throw new Error(`Error updating favorite entity. Code: ${error.code}`);
  }
}

export async function toggleFavoriteByUrl(
  url: string,
  status: FavoriteActionType,
  favoriteEntityId?: string,
): Promise<z.infer<typeof FavoriteEntityResponse> | undefined> {
  try {
    if (status === 'CREATE') {
      const res = await prisma.favoriteEntity.create({
        data: {
          url,
          entityType: 'SEARCH_QUERY',
          name: url,
        },
      });

      revalidateFavoritesAll();
      return res;
    } else if (status === 'EDIT') {
      const res = await prisma.favoriteEntity.update({
        where: { id: favoriteEntityId },
        data: { url: url },
      });

      revalidateFavoritesAll();
      return res;
    } else if (status === 'DELETE') {
      const res = await prisma.favoriteEntity.delete({
        where: { id: favoriteEntityId },
      });

      revalidateFavoritesAll();
      return res;
    }
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at toggleFavoriteByUrl(): ', JSON.stringify(error));
    throw new Error(`Error updating favorite entity. Code: ${error.code}`);
  }
}

export async function getEntityByFavoriteTypeId(
  entity: FavoriteEntity,
): Promise<SubscriptionWithBillDues | BillDueWithSubscriptionOnly | null> {
  try {
    if (entity.entityType === 'SUBSCRIPTION' && entity.subscriptionId) {
      const subscription: SubscriptionWithBillDues | null = await prisma.subscription.findUnique({
        where: { id: entity.subscriptionId },
        include: {
          billDues: {
            include: {
              subscription: true,
            },
            orderBy: {
              dueDate: 'desc',
            },
          },
        },
      });

      const currentYearDateTime: DateTime = DateTime.now().setZone(EST_TIME_ZONE);
      const currentYear: number = currentYearDateTime.year;
      const currentYearStartLuxon = DateTime.fromObject(
        {
          year: currentYear,
          month: 1,
          day: 1,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        },
        {
          zone: EST_TIME_ZONE,
        },
      );
      const currentYearEndLuxon = currentYearStartLuxon.endOf('year');
      const startDateEpoch = currentYearStartLuxon.toMillis();
      const endDateEpoch = currentYearEndLuxon.toMillis();

      const sortedSubscriptionBillDues: BillDueWithSubscription[] = (subscription?.billDues ?? []).toSorted(
        (a: BillDueWithSubscription, b: BillDueWithSubscription) => {
          return (a.dueDate ?? 0) > (b.dueDate ?? 0) ? 1 : -1;
        },
      );

      if (subscription) {
        subscription.billDues = sortedSubscriptionBillDues;
      }

      const subscriptionsToReturnWithDateInEST: SubscriptionWithBillDues[] = transformSubscriptionExtraProps(
        subscription ? [subscription] : [],
        startDateEpoch,
        endDateEpoch,
      );

      const subscriptionsWithFavoriteProps: SubscriptionWithBillDues[] =
        transformSubscriptionExtraPropsForFavorite(subscriptionsToReturnWithDateInEST);

      const result: SubscriptionWithBillDues = subscriptionsWithFavoriteProps[0];

      return result;
    } else if (entity.entityType === 'BILL_DUE' && entity.billDueId) {
      const billDue: BillDueWithSubscriptionOnly | null = await prisma.billDue.findUnique({
        where: { id: entity.billDueId },
        include: {
          subscription: true,
        },
      });
      return billDue;
    }
    return null;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getFavoriteById(): ', JSON.stringify(error));
    throw new Error(`Error retrieving favorite by id. Code: ${error.code}`);
  }
}

export async function getEntityByUrl(url: string): Promise<FavoriteEntity | null> {
  try {
    const favoriteEntity = await prisma.favoriteEntity.findFirst({
      where: { url },
    });
    return favoriteEntity;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getEntityByUrl(): ', JSON.stringify(error));
    throw new Error(`Error retrieving entity by url. Code: ${error.code}`);
  }
}
