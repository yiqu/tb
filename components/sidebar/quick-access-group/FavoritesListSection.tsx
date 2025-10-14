/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import Link from 'next/link';
import { Calendar, CalendarSync } from 'lucide-react';

import Typography from '@/components/typography/Typography';
import { SidebarMenuSubItem } from '@/components/ui/sidebar';
import { FavoriteEntity } from '@/models/favorites/favorite.model';
import FavoriteBillDue from '@/shared/side-nav/favorites/FavoriteBillDue';
import FavoriteSubscription from '@/shared/side-nav/favorites/FavoriteSubscription';

import SidebarMenuSubButtonFavoritesParentWithActive from '../SidebarMenuSubButtonFavoritesParentWithActive';

export default function FavoritesListSection({ allFavorites }: { allFavorites: FavoriteEntity[] }) {
  console.log('allFavorites', allFavorites);
  return (
    <>
      { allFavorites.map((favorite) => {
        return (
          <SidebarMenuSubItem key={ favorite.id }>
            <SidebarMenuSubButtonFavoritesParentWithActive favoriteId="1">
              { favorite.entityType === 'BILL_DUE' ?
                <FavoriteBillDue key={ favorite.id } favorite={ favorite } />
              : favorite.entityType === 'SUBSCRIPTION' ?
                <FavoriteSubscription key={ favorite.id } favorite={ favorite } />
              : <Typography key={ favorite.id }>Incompatible entity type</Typography> }
            </SidebarMenuSubButtonFavoritesParentWithActive>
          </SidebarMenuSubItem>
        );
      }) }
      { /* <SidebarMenuSubItem>
        <SidebarMenuSubButtonFavoritesParentWithActive favoriteId="1">
          <Link href={ '/' } prefetch className="flex items-center">
            <CalendarSync />
            <span>{ '1' }</span>
          </Link>
        </SidebarMenuSubButtonFavoritesParentWithActive>
      </SidebarMenuSubItem>
      <SidebarMenuSubItem>
        <SidebarMenuSubButtonFavoritesParentWithActive favoriteId="2">
          <Link href={ '/' } prefetch className="flex items-center">
            <Calendar />
            <span>{ '2' }</span>
          </Link>
        </SidebarMenuSubButtonFavoritesParentWithActive>
      </SidebarMenuSubItem> */ }
    </>
  );
}
