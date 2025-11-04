import { queryOptions } from '@tanstack/react-query';

import { FavoriteEntity } from '@/models/favorites/favorite.model';
import { BillDueWithSubscriptionOnly } from '@/models/bills/bills.model';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import {
  TANSTACK_QUERY_QUERY_KEY_ID_GENERAL,
  TANSTACK_QUERY_QUERY_KEY_FAVORITES_ALL,
  TANSTACK_QUERY_QUERY_KEY_FAVORITE_DETAILS,
  TANSTACK_QUERY_QUERY_KEY_FAVORITE_DETAILS_ID,
} from '@/constants/constants';

import { getEntityByUrl, getAllFavoritesEntities, getEntityByFavoriteTypeId } from '../favorites.server';

// Fetch functions
async function getAllFavorites(): Promise<FavoriteEntity[]> {
  const res: FavoriteEntity[] = await getAllFavoritesEntities();
  return res;
}

async function getFavoriteById(favoriteEntity: FavoriteEntity): Promise<SubscriptionWithBillDues | BillDueWithSubscriptionOnly | null> {
  const res: SubscriptionWithBillDues | BillDueWithSubscriptionOnly | null = await getEntityByFavoriteTypeId(favoriteEntity);
  return res;
}

async function getFavoriteByUrl(url: string): Promise<FavoriteEntity | null> {
  const res: FavoriteEntity | null = await getEntityByUrl(url);
  return res;
}

// TanStack Query options
export function getAllFavoritesQueryOptions() {
  return queryOptions({
    queryKey: [TANSTACK_QUERY_QUERY_KEY_FAVORITES_ALL],
    queryFn: getAllFavorites,
    staleTime: 1000 * 1 * 60 * 5, // 5 minutes
  });
}

export function getFavoriteByIdQueryOptions(favoriteEntity: FavoriteEntity) {
  return queryOptions({
    queryKey: [
      TANSTACK_QUERY_QUERY_KEY_FAVORITE_DETAILS,
      {
        [TANSTACK_QUERY_QUERY_KEY_FAVORITE_DETAILS_ID]: favoriteEntity.id,
      },
    ],
    queryFn: getFavoriteById.bind(null, favoriteEntity),
    staleTime: 1000 * 1 * 60 * 20, // 20 minutes
  });
}

export function getFavoriteByUrlQueryOptions(url: string) {
  return queryOptions({
    queryKey: [
      TANSTACK_QUERY_QUERY_KEY_FAVORITE_DETAILS,
      {
        [TANSTACK_QUERY_QUERY_KEY_ID_GENERAL]: url,
      },
    ],
    queryFn: getFavoriteByUrl.bind(null, url),
    staleTime: 1000 * 1 * 60 * 20, // 20 minutes
  });
}
