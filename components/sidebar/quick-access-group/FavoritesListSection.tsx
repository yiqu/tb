'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { Skeleton } from '@/components/ui/skeleton';
import { getUSDFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import { SidebarMenuSubItem } from '@/components/ui/sidebar';
import { FavoriteEntity } from '@/models/favorites/favorite.model';
import DateRelativeDisplay from '@/shared/table/DateRelativeDisplay';
import EntityDisplayMedia from '@/shared/components/EntityDisplayMedia';
import { getBillDueByIdQueryOptions } from '@/server/bills/query/bills.query';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

import FavoriteItemDetails from './FavoriteItemDetails';
import SidebarMenuSubButtonFavoritesParentWithActive from '../SidebarMenuSubButtonFavoritesParentWithActive';

const usdFormatter = getUSDFormatter();

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
            <HoverCardContent className="min-w-130" align="end" side="right">
              <FavoriteItemDetails favoriteEntity={ favorite } />
            </HoverCardContent>
          </HoverCard>
        );
      }) }
    </>
  );
}

function FavoriteItemName({ entity }: { entity: FavoriteEntity }) {
  const {
    data: billDue,
    isLoading: isBillDueLoading,
    isError: isBillDueError,
  } = useQuery({
    ...getBillDueByIdQueryOptions(entity.entityType === 'BILL_DUE' ? (entity.billDueId ?? '') : ''),
    enabled: entity.entityType === 'BILL_DUE' && !!entity.billDueId,
  });

  if (entity.entityType === 'SUBSCRIPTION') {
    return <Typography className="truncate">{ entity.name }</Typography>;
  }

  if (entity.entityType === 'BILL_DUE') {
    const dueDate: string | undefined = billDue?.dueDate;
    const subscriptionName: string | undefined = billDue?.subscription.name;
    const cost: number | undefined = billDue?.cost ?? billDue?.subscription.cost;

    return (
      <div className="flex w-full flex-row items-center justify-start gap-x-1 truncate">
        <Typography className="">{ usdFormatter.format(cost ?? 0) } |</Typography>
        <Typography className="truncate">{ subscriptionName } |</Typography>
        { isBillDueLoading ?
          <Skeleton className="h-5 w-full truncate" />
        : isBillDueError ?
          <Typography className="truncate text-red-500">Error loading bill due</Typography>
        : <DateRelativeDisplay time={ dueDate as any } largest={ 1 } updateInterval={ 120_000 } useShortText={ true } className={ `truncate` } overrideHideSeconds /> }
      </div>
    );
  }

  return <Typography className="truncate">{ entity.name }</Typography>;
}
