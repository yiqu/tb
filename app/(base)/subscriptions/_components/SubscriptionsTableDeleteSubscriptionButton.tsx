'use client';

import toast from 'react-hot-toast';
import { useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { Trash, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Typography from '@/components/typography/Typography';
import { deleteSubscription } from '@/server/subscriptions/subscriptions.server';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';

export default function SubscriptionsTableDeleteSubscriptionButton({ subscription }: { subscription: SubscriptionWithBillDues }) {
  const [isPending, startTransition] = useTransition();

  const handleOnDeleteSubscription = async (formData: FormData) => {
    const subscriptionId = formData.get('subscriptionId') as string;
    if (!subscriptionId) {
      toast.error('Subscription ID is required.');
      return;
    }

    startTransition(async () => {
      await toast.promise(deleteSubscription(subscriptionId), {
        loading: `Deleting subscription ${subscription.name}...`,
        success: (res: SubscriptionWithBillDues) => {
          return `Deleted subscription ${res.name}.`;
        },
        error: (error: Error) => {
          return `Failed to delete subscription. ${error.message}`;
        },
      });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-6" disabled={ isPending } type="button">
          { isPending ?
            <RefreshCcw className="size-4 animate-spin text-red-500" />
          : <Trash /> }
        </Button>
      </DialogTrigger>

      <DialogContent
        className={ `
          overflow-x-auto px-0 pb-0
          two:w-[800px] two:max-w-[1000px]!
          main:w-[1000px] main:max-w-[1200px]!
          sm:max-w-[600px]
        ` }
      >
        <form action={ handleOnDeleteSubscription } className="flex flex-col gap-y-4">
          <input type="hidden" name="subscriptionId" value={ subscription.id } />
          <DialogHeader className="px-4">
            <DialogTitle>Delete Subscription</DialogTitle>
            <DialogDescription>Are you sure you want to delete this subscription? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="flex flex-col gap-y-2 px-6">
            <Typography variant="body1">Subscription: { subscription.name }</Typography>
            <Typography variant="body1">Bills count: { subscription.billDues.length }</Typography>
          </div>

          <DialogFooter className={ `
            flex w-full flex-row bg-sidebar p-4
            sm:items-center sm:justify-between
          ` }>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <DeleteButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" disabled={ pending }>
      { pending ?
        <RefreshCcw className="size-4 animate-spin" />
      : <Trash /> }
      Delete
    </Button>
  );
}
