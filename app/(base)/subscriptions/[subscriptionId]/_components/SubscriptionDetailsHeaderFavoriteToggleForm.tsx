'use client';

import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Trash, RotateCcw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { DialogClose } from '@/components/ui/dialog';
import { FormInput } from '@/components/hook-form/Input';
import DisplayCard from '@/shared/components/DisplayCard';
import StyledDialogFooter from '@/shared/dialogs/StyledDialogFooter';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { newFavoriteAddableSchema, addNewFavoriteNameInputSchema } from '@/validators/favorites/favorites.schema';
import { FavoriteActionType, FavoriteEntityResponseType, FavoriteEntityEntityTypeType } from '@/models/favorites/favorite.model';

type Props = {
  type: FavoriteEntityEntityTypeType;
  subscription?: SubscriptionWithBillDues;
  billDue?: BillDueWithSubscription;
  favoriteEntity?: FavoriteEntityResponseType | null;
  disableButton: boolean;
  onFormSubmitAction: (_data: z.infer<typeof newFavoriteAddableSchema>, _actionType: FavoriteActionType) => void;
};

export default function SubscriptionDetailsHeaderFavoriteToggleForm({
  type,
  subscription,
  billDue,
  favoriteEntity,
  disableButton,
  onFormSubmitAction,
}: Props) {
  const form = useForm<z.infer<typeof addNewFavoriteNameInputSchema>>({
    resolver: zodResolver(addNewFavoriteNameInputSchema),
    defaultValues: {
      favoriteName: favoriteEntity ? (favoriteEntity?.name ?? '') : '',
    },
  });

  const isFavorited = !!favoriteEntity;
  const actionType: FavoriteActionType = isFavorited ? 'EDIT' : 'CREATE';
  const isFormDirty = form.formState.isDirty;

  function onSubmit(data: z.infer<typeof addNewFavoriteNameInputSchema>) {
    onFormSubmitAction(
      {
        favoriteName: data.favoriteName,
        entityId:
          type === 'SUBSCRIPTION' ? (subscription?.id ?? '')
          : type === 'BILL_DUE' ? (billDue?.id ?? '')
          : '',
        entityType: type,
      },
      actionType,
    );
  }

  const handleOnReset = () => {
    form.reset();
  };

  const handleOnClearField = (name: string) => {
    form.setValue(name as 'favoriteName', '');
  };

  const handleOnDelete = () => {
    onFormSubmitAction(
      {
        favoriteName: favoriteEntity?.name ?? '',
        entityId:
          type === 'SUBSCRIPTION' ? (subscription?.id ?? '')
          : type === 'BILL_DUE' ? (billDue?.id ?? '')
          : '',
        entityType: type,
      },
      'DELETE',
    );
  };

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit(onSubmit) } id="update-favorite-name-input-form">
        <div className="overflow-y-auto px-4">
          <DisplayCard>
            <CardContent className="flex w-full flex-col items-start justify-start gap-y-4">
              <FormInput
                name="favoriteName"
                label="Favorite Name"
                control={ form.control }
                formItemClassName="w-full"
                clearField={ handleOnClearField }
              />
            </CardContent>
          </DisplayCard>
        </div>
        <StyledDialogFooter>
          <div className="flex w-full flex-row items-center justify-between gap-x-2">
            <div className="flex flex-row items-center justify-start gap-x-2">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  <X />
                  Close
                </Button>
              </DialogClose>
              { isFormDirty ?
                <Button variant={ 'outline' } onClick={ handleOnReset } type="button" disabled={ disableButton }>
                  <RotateCcw />
                  Reset
                </Button>
              : null }
              { isFavorited ?
                <Button variant={ 'outline' } onClick={ handleOnDelete } type="button" className="text-destructive" disabled={ disableButton }>
                  <Trash />
                  Delete
                </Button>
              : null }
            </div>
            <div className="flex flex-row items-center justify-end gap-x-2">
              <Button
                type="submit"
                id="edit-subscription-dialog-save-button"
                disabled={ disableButton }
                className={ cn({
                  'border border-red-600': false,
                }) }
                form="update-favorite-name-input-form"
              >
                <Save />
                Save
              </Button>
            </div>
          </div>
        </StyledDialogFooter>
      </form>
    </Form>
  );
}
