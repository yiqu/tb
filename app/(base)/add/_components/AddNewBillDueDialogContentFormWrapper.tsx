'use client';

import z from 'zod';
import { DateTime } from 'luxon';
import { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useQueryState } from 'nuqs';
import confetti from 'canvas-confetti';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { addBillDue } from '@/server/bills/bills.server';
import { billAddableSchema } from '@/validators/bills/bill.schema';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { useSubscriptionStoreActions } from '@/store/subscriptions/subscriptions.store';

export default function AddNewBillDueDialogContentFormWrapper({
  children,
  subscriptionId,
  subscription,
}: {
  children: ReactNode;
  subscriptionId: string;
  subscription: SubscriptionWithBillDues;
}) {
  const { setSubscriptionIdBeingEdited } = useSubscriptionStoreActions();
  const [, setAddBillDueSubscriptionId] = useQueryState('addBillDueSubscriptionId', {
    scroll: false,
  });
  // const currentDateLuxon = DateTime.now().setZone(EST_TIME_ZONE);
  // const currentDateLuxonMidDay12pm: string = currentDateLuxon.set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).toMillis().toString();

  const methods = useForm<z.infer<typeof billAddableSchema>>({
    defaultValues: {
      dueDate: '1734460800000',
      paid: false,
      reimbursed: false,
      cost: subscription?.cost ?? 0,
      subscriptionId,
      consecutiveAdd: false,
    },
    resolver: zodResolver(billAddableSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const onSubmit = async (data: z.infer<typeof billAddableSchema>) => {
    setSubscriptionIdBeingEdited(subscriptionId);
    toast.remove();
    toast.promise(addBillDue(subscriptionId, data), {
      loading: 'Adding bill due...',
      success: (res: BillDueWithSubscription) => {
        confetti({
          particleCount: 80,
        });

        if (data.consecutiveAdd) {
          // get the next month's 1st day in luxon date
          const dateLuxonFromData = DateTime.fromMillis(Number.parseInt(data.dueDate));
          const nextMonthLuxon = dateLuxonFromData.plus({ month: 1 });
          // reset the form with the next month's 1st day
          methods.reset({
            dueDate: nextMonthLuxon.toMillis().toString(),
            paid: false,
            reimbursed: false,
            cost: data?.cost ?? 0,
            subscriptionId,
            consecutiveAdd: data.consecutiveAdd,
          });
        } else {
          setAddBillDueSubscriptionId(null, {
            history: 'replace',
            scroll: false,
          });
        }

        setSubscriptionIdBeingEdited(subscriptionId, true);
        return `Added new bill due for ${res.subscription.name}.`;
      },
      error: (error: Error) => {
        (setSubscriptionIdBeingEdited(subscriptionId), true);
        return `Failed to add bill due. ${error.message}`;
      },
    });
  };

  return (
    <Form { ...methods }>
      <form onSubmit={ methods.handleSubmit(onSubmit) } id="add-new-bill-due-dialog-form">
        { children }
      </form>
    </Form>
  );
}
