'use client';

import z from 'zod';
import omit from 'lodash/omit';
import { DateTime } from 'luxon';
import toast from 'react-hot-toast';
import { Heart } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { toggleFavoriteByBillDueId } from '@/server/favorites/favorites.server';
import { FavoriteEntity, FavoriteEntityResponse } from '@/models/favorites/favorite.model';
import { TANSTACK_QUERY_QUERY_KEY_ID_GENERAL, TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS } from '@/constants/constants';

import { Button, buttonVariants } from '../ui/button';

interface Props {
  billDue: BillDueWithSubscription;
  buttonClassName?: string;
  buttonProps?: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>;
}

/**
 * This button is used to toggle the favorite status of a bill due in the edit bill dialog.
 * It uses optimistic updates to update the state of the button while the request is being made.
 *
 * Button is disabled while the request is being made because a DELETE can not sent if the favorite does not exist.
 */
export default function EditBillDialogFavoriteBillToggleButton({ billDue, buttonClassName, buttonProps }: Props) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const favoriteObject: FavoriteEntity | undefined = billDue.favorites?.[0];
  const isFavorite: boolean = !!favoriteObject;

  const [optimisticIsFavorite, setOptimisticIsFavorite] = useOptimistic(isFavorite, (currentState: boolean, optimisticValue: boolean) => {
    return optimisticValue;
  });

  const handleOnFavoriteToggle = (isFavorited: boolean) => {
    if (isPending) return;

    startTransition(async () => {
      const nextValue: boolean = !isFavorited;
      setOptimisticIsFavorite(nextValue);
      await toast.promise(
        toggleFavoriteByBillDueId(
          billDue.id,
          `${billDue.subscription.name} - ${billDue.dueDate}`,
          nextValue ? 'CREATE' : 'DELETE',
          favoriteObject?.id,
        ),
        {
          loading: `${nextValue ? 'Adding' : 'Removing'} ${billDue.subscription.name} bill $${billDue.cost} due on ${billDue.dueDate} to favorites...`,
          success: (_res: z.infer<typeof FavoriteEntityResponse> | undefined) => {
            queryClient.invalidateQueries({
              queryKey: [
                TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS,
                {
                  [TANSTACK_QUERY_QUERY_KEY_ID_GENERAL]: billDue.id,
                },
              ],
            });
            const dueDateInEst: string = DateTime.fromMillis(Number.parseInt(billDue.dueDate))
              .setZone(EST_TIME_ZONE)
              .toFormat('MM/dd/yyyy');
            return `${billDue.subscription.name} bill - $${billDue.cost} - due on ${dueDateInEst} ${nextValue ? 'added to' : 'removed from'} favorites.`;
          },
          error: (error: Error) => {
            return `Failed. Reason: ${error.message}`;
          },
        },
      );
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={ cn(buttonClassName, { 'border-2 border-yellow-600': isPending }) }
      type="button"
      onClick={ handleOnFavoriteToggle.bind(null, optimisticIsFavorite) }
      title={ optimisticIsFavorite ? `Edit favorite: ${favoriteObject?.name}` : `Add to favorites` }
      { ...omit(buttonProps, 'className') }
      disabled={ isPending }
    >
      <Heart
        className={ cn({
          'fill-primary text-primary': optimisticIsFavorite,
        }) }
      />
    </Button>
  );
}
