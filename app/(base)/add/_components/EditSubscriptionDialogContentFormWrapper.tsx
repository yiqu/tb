'use client';

import z from 'zod';
import toast from 'react-hot-toast';
import { useQueryState } from 'nuqs';
import { use, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { updateSubscription } from '@/server/subscriptions/subscriptions.server';
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
      description: subscription?.description ?? undefined,
      url: subscription?.url ?? undefined,
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
    toast.promise(updateSubscription(subscriptionId, data), {
      loading: 'Updating subscription...',
      success: (res: SubscriptionWithBillDues) => {
        confetti({
          particleCount: 80,
        });

        setEditSubscriptionId(null, {
          scroll: false,
        });
        return `Updated ${res.name}.`;
      },
      error: (error: Error) => {
        return `Failed to update subscription. ${error.message}`;
      },
    });
  };

  return (
    <Form { ...methods }>
      <form onSubmit={ methods.handleSubmit(onSubmit) } id="edit-subscription-dialog-form">
        { children }
      </form>
    </Form>
  );
}
