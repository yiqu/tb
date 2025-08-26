'use client';

import z from 'zod';
import { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useQueryState } from 'nuqs';
import confetti from 'canvas-confetti';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { TANSTACK_MUTATION_KEY_SUBSCRIPTION_CREATE } from '@/constants/constants';
import { createNewSubscription } from '@/server/subscriptions/subscriptions.server';
import subscriptionsTableViewStore from '@/store/subscriptions/subscriptions.store';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { subscriptionAddableSchema } from '@/validators/subscriptions/subscriptions.schema';

export default function AddSubscriptionDialogContentFormWrapper({
  children,
  redirectToNewSubscriptionAfterCreation,
}: {
  children: ReactNode;
  redirectToNewSubscriptionAfterCreation?: boolean;
}) {
  const [, setAddNewSubscription] = useQueryState('addNewSubscription', {
    scroll: false,
  });
  const nav = useRouter();
  const setSubscriptionIdBeingEdited = subscriptionsTableViewStore.use.setSubscriptionIdBeingEdited();
  const clearSubscriptionIdBeingEdited = subscriptionsTableViewStore.use.clearSubscriptionIdBeingEdited();

  const { mutate } = useMutation({
    mutationFn: (data: z.infer<typeof subscriptionAddableSchema>) => {
      return createNewSubscription(data);
    },
    mutationKey: [TANSTACK_MUTATION_KEY_SUBSCRIPTION_CREATE],
    onMutate: (data: z.infer<typeof subscriptionAddableSchema>) => {
      toast.remove();
      toast.loading(`Creating subscription ${data.name}...`);
    },
    onSuccess: async (data: SubscriptionWithBillDues) => {
      toast.remove();
      toast.success(`Created subscription ${data.name}.`);
      confetti({
        particleCount: 80,
      });
      clearSubscriptionIdBeingEdited('new-subscription');

      // if (redirectToNewSubscriptionAfterCreation) {
      //   nav.push(`/subscriptions/${data.id}`);
      // } else {
      //   setAddNewSubscription(null, {
      //     scroll: false,
      //   });
      // }
    },
    onError: (error: Error) => {
      toast.remove();
      toast.error(`Failed to create subscription. ${error.message}`);
      clearSubscriptionIdBeingEdited('new-subscription');
    },
    gcTime: 1,
  });

  const methods = useForm<z.infer<typeof subscriptionAddableSchema>>({
    defaultValues: {
      name: '',
      description: '',
      url: '',
      approved: true,
      signed: false,
      cost: '',
      billCycleDuration: 'monthly',
    },
    resolver: zodResolver(subscriptionAddableSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const onSubmit = async (data: z.infer<typeof subscriptionAddableSchema>) => {
    setSubscriptionIdBeingEdited('new-subscription');
    mutate(data);
  };

  return (
    <Form { ...methods }>
      <form onSubmit={ methods.handleSubmit(onSubmit) } id="add-subscription-content-form">
        { children }
      </form>
    </Form>
  );
}
