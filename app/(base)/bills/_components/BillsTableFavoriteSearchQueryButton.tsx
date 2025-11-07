'use client';

import omit from 'lodash/omit';
import toast from 'react-hot-toast';
import { Heart } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { VariantProps } from 'class-variance-authority';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { BillDueSearchParams } from '@/models/bills/bills.model';
import { toggleFavoriteByUrl } from '@/server/favorites/favorites.server';
import { FavoriteEntityResponseType } from '@/models/favorites/favorite.model';
import { getFavoriteByUrlQueryOptions } from '@/server/favorites/query/favorites.query';
import { TANSTACK_QUERY_QUERY_KEY_ID_GENERAL, TANSTACK_QUERY_QUERY_KEY_FAVORITE_DETAILS } from '@/constants/constants';

interface Props {
  buttonProps?: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>;
  searchParams: BillDueSearchParams;
}

export default function BillsTableFavoriteSearchQueryButton({ buttonProps, searchParams }: Props) {
  const favoriteUrl = `/bills?${new URLSearchParams(searchParams as Record<string, string>).toString()}`;
  const {
    data: favoriteObjectByUrl,
    isLoading: isFavoriteLoading,
    isError: _isFavoriteError,
  } = useQuery(getFavoriteByUrlQueryOptions(favoriteUrl));
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const isFavorite: boolean = !!favoriteObjectByUrl;

  const [optimisticIsFavorite, setOptimisticIsFavorite] = useOptimistic(isFavorite, (currentState: boolean, optimisticValue: boolean) => {
    return optimisticValue;
  });

  const handleOnFavoriteToggle = (isFavorited: boolean) => {
    if (isPending) return;

    const favoriteUrl = `/bills?${new URLSearchParams(searchParams as Record<string, string>).toString()}`;

    startTransition(async () => {
      const nextValue: boolean = !isFavorited;
      setOptimisticIsFavorite(nextValue);

      await toast.promise(toggleFavoriteByUrl(favoriteUrl, nextValue ? 'CREATE' : 'DELETE', favoriteObjectByUrl?.id), {
        loading: `${nextValue ? 'Adding' : 'Removing'} ${favoriteUrl} to favorites...`,
        success: (_res: FavoriteEntityResponseType | undefined) => {
          queryClient.invalidateQueries({
            queryKey: [
              TANSTACK_QUERY_QUERY_KEY_FAVORITE_DETAILS,
              {
                [TANSTACK_QUERY_QUERY_KEY_ID_GENERAL]: favoriteUrl,
              },
            ],
          });
          return `${favoriteUrl} ${nextValue ? 'added to' : 'removed from'} favorites.`;
        },
        error: (error: Error) => {
          return `Failed. Reason: ${error.message}`;
        },
      });
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={ cn('', { 'border-2 border-yellow-600': isPending }) }
      type="button"
      onClick={ handleOnFavoriteToggle.bind(null, optimisticIsFavorite) }
      title={ `${isFavorite ? 'Remove this search query from' : 'Add this search query to'} favorites` }
      { ...omit(buttonProps, 'className') }
      disabled={ isPending || isFavoriteLoading }
    >
      <Heart
        className={ cn({
          'fill-primary text-primary': optimisticIsFavorite,
        }) }
      />
    </Button>
  );
}
