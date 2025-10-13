import { queryOptions } from '@tanstack/react-query';

import { FavoriteEntity } from '@/models/favorites/favorite.model';
import { TANSTACK_QUERY_QUERY_KEY_FAVORITES_ALL } from '@/constants/constants';

import { getAllFavoritesEntities } from '../favorites.server';

// Fetch functions
async function getAllFavorites(): Promise<FavoriteEntity[]> {
  const res: FavoriteEntity[] = await getAllFavoritesEntities();
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
