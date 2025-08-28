'use client';

import z from 'zod';
import { DateTime } from 'luxon';
import { ReactNode } from 'react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { addBillDue } from '@/server/bills/bills.server';
import { useBillStoreActions } from '@/store/bills/bills.store';
import { billAddableSchema } from '@/validators/bills/bill.schema';
import { BillDueWithSubscription } from '@/models/bills/bills.model';

export default function AddNewBillFormWrapper({ children }: { children: ReactNode }) {
  const { setBillDueIdBeingEdited } = useBillStoreActions();
  const currentDateLuxon = DateTime.now().setZone(EST_TIME_ZONE);
  const currentDateLuxonMidDay12pm: string = currentDateLuxon.set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).toMillis().toString();

  const methods = useForm<z.infer<typeof billAddableSchema>>({
    defaultValues: {
      dueDate: currentDateLuxonMidDay12pm,
      paid: true,
      reimbursed: false,
      cost: 0,
      subscriptionId: '',
      consecutiveAdd: false,
    },
    resolver: zodResolver(billAddableSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const onSubmit = (data: z.infer<typeof billAddableSchema>) => {
    toast.remove();
    const { subscriptionId } = data;
    setBillDueIdBeingEdited('new-bill-due');
    toast.promise(
      addBillDue(subscriptionId, {
        cost: Number.parseFloat(data.cost.toString()),
        dueDate: data.dueDate,
        paid: data.paid,
        reimbursed: data.reimbursed,
        subscriptionId,
      }),
      {
        loading: 'Adding bill due...',
        success: (data: BillDueWithSubscription) => {
          const dateFormat = DateTime.fromMillis(Number.parseInt(data.dueDate)).toLocaleString(DateTime.DATETIME_SHORT);
          confetti({
            particleCount: 80,
          });
          setBillDueIdBeingEdited('new-bill-due', true);
          return `Added bill due for ${data.subscription.name} on ${dateFormat}.`;
        },
        error: (error: Error) => {
          setBillDueIdBeingEdited('new-bill-due', true);
          return `Failed to add bill due. Reason: ${error.message}`;
        },
      },
    );
  };

  return (
    <Form { ...methods }>
      <form onSubmit={ methods.handleSubmit(onSubmit) } id="add-new-bill-due-page-form">
        { children }
      </form>
    </Form>
  );
}
