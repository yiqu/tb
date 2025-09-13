'use client';

import z from 'zod';
import toast from 'react-hot-toast';
import { use, useState } from 'react';
import confetti from 'canvas-confetti';
import { Pencil, HeartPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ToggleFavoriteDialog from '@/components/dialogs/ToggleFavoriteDialog';
import { newFavoriteAddableSchema } from '@/validators/favorites/favorites.schema';
import { toggleFavoriteBySubscriptionId } from '@/server/favorites/favorites.server';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import {
  FavoriteActionType,
  getFavoriteActionLabel,
  FavoriteEntityResponseType,
  FavoriteEntityEntityTypeType,
} from '@/models/favorites/favorite.model';

import SubscriptionDetailsHeaderFavoriteToggleForm from './SubscriptionDetailsHeaderFavoriteToggleForm';

type SubscriptionDetailsHeaderFavoriteToggleButtonProps = {
  isFavoriteEntityPromise: Promise<FavoriteEntityResponseType | null>;
  subscription: SubscriptionWithBillDues;
  type: FavoriteEntityEntityTypeType;
};

export default function SubscriptionDetailsHeaderFavoriteToggleButton({
  isFavoriteEntityPromise,
  subscription,
  type,
}: SubscriptionDetailsHeaderFavoriteToggleButtonProps) {
  const isFavoriteEntity: FavoriteEntityResponseType | null = use(isFavoriteEntityPromise);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const isFavorited = !!isFavoriteEntity;
  const action: FavoriteActionType = isFavorited ? 'EDIT' : 'CREATE';

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleOnClick = () => {
    setIsDialogOpen(true);
  };

  const handleOnOpenEditDialog = (open: boolean) => {
    setIsDialogOpen(open);
  };

  const handleOnFormSubmit = (data: z.infer<typeof newFavoriteAddableSchema>, actionType: FavoriteActionType) => {
    setDisableButton(true);
    toast.promise(toggleFavoriteBySubscriptionId(data.entityId, data.favoriteName, actionType, isFavoriteEntity?.id), {
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

  return (
    <>
      <Button variant={ isFavorited ? 'outline' : 'default' } onClick={ handleOnClick }>
        { isFavorited ?
          <Pencil />
        : <HeartPlus /> }
        { isFavorited ? 'Edit Favorite' : 'Favorite' }
      </Button>
      { isDialogOpen ?
        <ToggleFavoriteDialog isOpen={ isDialogOpen } handleOnOpenEditDialog={ handleOnOpenEditDialog } type="SUBSCRIPTION" action={ action }>
          <SubscriptionDetailsHeaderFavoriteToggleForm
            type={ type }
            subscription={ subscription }
            onFormSubmitAction={ handleOnFormSubmit }
            favoriteEntity={ isFavoriteEntity }
            disableButton={ disableButton }
          />
        </ToggleFavoriteDialog>
      : null }
    </>
  );
}
