'use client';

import Link from 'next/link';

import Typography from '@/components/typography/Typography';
import { SidebarMenuSubItem } from '@/components/ui/sidebar';
import { FavoriteEntity } from '@/models/favorites/favorite.model';
import EntityDisplayMedia from '@/shared/components/EntityDisplayMedia';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

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
                    <FavoriteItemName entity={ favorite } />
                  </Link>
                </SidebarMenuSubButtonFavoritesParentWithActive>
              </SidebarMenuSubItem>
            </HoverCardTrigger>
            <HoverCardContent className="min-w-120" align="end" side="right">
              <FavoriteItemDetails favoriteEntity={ favorite } />
            </HoverCardContent>
          </HoverCard>
        );
      }) }
    </>
  );
}

function FavoriteItemName({ entity }: { entity: FavoriteEntity }) {
  return <Typography className="truncate">{ entity.name }</Typography>;
}
