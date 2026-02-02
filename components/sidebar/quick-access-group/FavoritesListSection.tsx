'use client';

import Link from 'next/link';

import useIsClient from '@/hooks/useIsClient';
import { Skeleton } from '@/components/ui/skeleton';
import Typography from '@/components/typography/Typography';
import { SidebarMenuSubItem } from '@/components/ui/sidebar';
import { FavoriteEntity } from '@/models/favorites/favorite.model';
import EntityDisplayMedia from '@/shared/components/EntityDisplayMedia';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

import FavoriteItemName from './FavoriteItemName';
import FavoriteItemDetails from './FavoriteItemDetails';
import SidebarMenuSubButtonFavoritesParentWithActive from '../SidebarMenuSubButtonFavoritesParentWithActive';

export default function FavoritesListSection({ allFavorites }: { allFavorites: FavoriteEntity[] }) {
  return (
    <>
      { allFavorites.map((favorite: FavoriteEntity) => {
        return (
          <HoverCard key={ favorite.id } openDelay={ 150 } closeDelay={ 50 }>
            <HoverCardTrigger asChild>
              <SidebarMenuSubItem>
                <SidebarMenuSubButtonFavoritesParentWithActive favoriteId="">
                  <Link href={ `${favorite.url}` } prefetch className="flex w-full items-center justify-start">
                    <EntityDisplayMedia entity={ favorite.entityType } className="size-4" />
                    <FavoriteItemNameParent entity={ favorite } />
                  </Link>
                </SidebarMenuSubButtonFavoritesParentWithActive>
              </SidebarMenuSubItem>
            </HoverCardTrigger>
            <HoverCardContent className="min-w-130" align="end" side="right">
              <FavoriteItemDetails favoriteEntity={ favorite } />
            </HoverCardContent>
          </HoverCard>
        );
      }) }
    </>
  );
}

function FavoriteItemNameParent({ entity }: { entity: FavoriteEntity }) {
  const isClient = useIsClient();

  if (!isClient) {
    return <Skeleton className="h-5 w-full truncate" />;
  }

  if (entity.entityType === 'SUBSCRIPTION') {
    return <FavoriteItemName favoriteEntity={ entity } />;
  }

  if (entity.entityType === 'BILL_DUE') {
    return <FavoriteItemName favoriteEntity={ entity } />;
  }

  if (entity.entityType === 'SEARCH_QUERY') {
    return <FavoriteItemName favoriteEntity={ entity } />;
  }

  return <Typography className="truncate">{ entity.name }</Typography>;
}
