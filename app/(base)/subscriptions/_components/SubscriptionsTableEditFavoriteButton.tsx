'use client';

import z from 'zod';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

import { Button } from '@/components/ui/button';
import Typography from '@/components/typography/Typography';
import ToggleFavoriteDialog from '@/components/dialogs/ToggleFavoriteDialog';
import { newFavoriteAddableSchema } from '@/validators/favorites/favorites.schema';
import { toggleFavoriteBySubscriptionId } from '@/server/favorites/favorites.server';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { FavoriteEntity, FavoriteActionType, getFavoriteActionLabel, FavoriteEntityResponseType } from '@/models/favorites/favorite.model';

import SubscriptionDetailsHeaderFavoriteToggleForm from '../[subscriptionId]/_components/SubscriptionDetailsHeaderFavoriteToggleForm';

export default function SubscriptionsTableEditFavoriteButton({ subscription }: { subscription: SubscriptionWithBillDues }) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const favoriteEntity: FavoriteEntity | undefined = subscription.favorites?.[0];

  const handleOnClick = () => {
    setIsDialogOpen(true);
  };

  const handleOnOpenEditDialog = (open: boolean) => {
    setIsDialogOpen(open);
  };

  const handleOnFormSubmit = (data: z.infer<typeof newFavoriteAddableSchema>, actionType: FavoriteActionType) => {
    setDisableButton(true);
    toast.promise(toggleFavoriteBySubscriptionId(data.entityId, data.favoriteName, actionType, favoriteEntity?.id), {
      loading: `${getFavoriteActionLabel(actionType, true, false)}...`,
      success: (_res: FavoriteEntityResponseType | undefined) => {
        confetti({
          particleCount: 80,
        });
        setDisableButton(false);
        setIsDialogOpen(false);
        return `${getFavoriteActionLabel(actionType, false, false)}: ${_res?.name}.`;
      },
      error: (error: Error) => {
        setDisableButton(false);
        return `${getFavoriteActionLabel(actionType, true, false)} failed. ${error.message}`;
      },
    });
  };

  if (!favoriteEntity) {
    return <Typography>*</Typography>;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-6"
        type="button"
        onClick={ handleOnClick }
        title={ `Edit favorite: ${favoriteEntity?.name}` }
      >
        <Heart className="fill-primary text-primary" />
      </Button>
      { isDialogOpen ?
        <ToggleFavoriteDialog isOpen={ isDialogOpen } handleOnOpenEditDialog={ handleOnOpenEditDialog } type="SUBSCRIPTION" action={ 'EDIT' }>
          <SubscriptionDetailsHeaderFavoriteToggleForm
            type={ favoriteEntity.entityType }
            subscription={ subscription }
            onFormSubmitAction={ handleOnFormSubmit }
            favoriteEntity={ favoriteEntity }
            disableButton={ disableButton }
          />
        </ToggleFavoriteDialog>
      : null }
    </>
  );
}
