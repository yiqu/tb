'use client';

import toast from 'react-hot-toast';
import { useTransition } from 'react';
import { Trash, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getUSDFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import { deleteBillDue } from '@/server/bills/bills.server';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
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

const usdFormatter = getUSDFormatter();

export default function BillsTableDeleteBillButton({ billDue }: { billDue: BillDueWithSubscription }) {
  const [isPending, startTransition] = useTransition();

  const handleOnDeleteBill = async (formData: FormData) => {
    const billDueId = formData.get('billDueId') as string;
    if (!billDueId) {
      toast.error('Bill due ID is required.');
      return;
    }

    startTransition(async () => {
      await toast.promise(deleteBillDue(billDueId), {
        loading: 'Deleting bill...',
        success: (res: BillDueWithSubscription) => {
          return `${res.subscription.name}'s bill deleted successfully.`;
        },
        error: (error: Error) => {
          return `Failed to delete bill. ${error.message}`;
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
        <form action={ handleOnDeleteBill }>
          <input type="hidden" name="billDueId" value={ billDue.id } />
          <div className="flex flex-col gap-y-4 px-6">
            <DialogHeader>
              <DialogTitle>Delete Bill</DialogTitle>
              <DialogDescription>Are you sure you want to delete this bill? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-y-2">
              <Typography>Subscription Name: { billDue.subscription.name }</Typography>
              <Typography>Bill Amount: { usdFormatter.format(billDue.cost ?? 0) }</Typography>
            </div>
          </div>
          <DialogFooter className={ `
            mt-4 flex w-full flex-row bg-sidebar p-4
            sm:items-center sm:justify-between
          ` }>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
