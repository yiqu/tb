'use client';

import z from 'zod';
import { DateTime } from 'luxon';
import toast from 'react-hot-toast';
import { useQueryState } from 'nuqs';
import { use, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { addBillDue } from '@/server/bills/bills.server';
import { billAddableSchema } from '@/validators/bills/bill.schema';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { subscriptionEditableSchema } from '@/validators/subscriptions/subscriptions.schema';

export default function EditSubscriptionDialogContentFormWrapper({
  children,
  subscriptionId,
  subscriptionPromise,
}: {
  children: ReactNode;
  subscriptionId: string;
  subscriptionPromise: Promise<SubscriptionWithBillDues | null>;
}) {
  const subscription: SubscriptionWithBillDues | null = use(subscriptionPromise);

  const [, setEditSubscriptionId] = useQueryState('editSubscriptionId', {
    scroll: false,
  });

  const methods = useForm<z.infer<typeof subscriptionEditableSchema>>({
    defaultValues: {
      name: subscription?.name ?? '',
      description: subscription?.description ?? '',
      url: subscription?.url ?? '',
      approved: subscription?.approved ?? false,
      signed: subscription?.signed ?? false,
      cost: subscription?.cost ?? 0,
      billCycleDuration: subscription?.billCycleDuration as 'yearly' | 'monthly' | 'once',
    },
    resolver: zodResolver(subscriptionEditableSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const onSubmit = async (data: z.infer<typeof subscriptionEditableSchema>) => {
    console.log(data);
  };

  return (
    <Form { ...methods }>
      <form onSubmit={ methods.handleSubmit(onSubmit) } id="edit-subscription-dialog-form">
        { children }
      </form>
    </Form>
  );
}
