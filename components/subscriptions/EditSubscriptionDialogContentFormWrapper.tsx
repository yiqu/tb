'use client';

import z from 'zod';
import { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useQueryState } from 'nuqs';
import confetti from 'canvas-confetti';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Form } from '@/components/ui/form';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { updateSubscriptionFn } from '@/server/subscriptions/query/subscription.query';
import { subscriptionEditableSchema } from '@/validators/subscriptions/subscriptions.schema';
import { TANSTACK_MUTATION_KEY_SUBSCRIPTION_UPDATE, TANSTACK_QUERY_QUERY_KEY_SUBSCRIPTION_DETAILS } from '@/constants/constants';

export default function EditSubscriptionDialogContentFormWrapper({
  children,
  subscriptionId,
  subscription,
}: {
  children: ReactNode;
  subscriptionId: string;
  subscription: SubscriptionWithBillDues;
}) {
  const queryClient = useQueryClient();
  const [, setEditSubscriptionId] = useQueryState('editSubscriptionId', {
    scroll: false,
  });

  const { mutate } = useMutation({
    mutationFn: (data: z.infer<typeof subscriptionEditableSchema>) => {
      return updateSubscriptionFn(subscriptionId, data);
    },
    mutationKey: [TANSTACK_MUTATION_KEY_SUBSCRIPTION_UPDATE],
    onMutate: (data: z.infer<typeof subscriptionEditableSchema>) => {
      toast.remove();
      toast.loading(`Updating ${data.name}...`);
    },
    onSuccess: async (data: SubscriptionWithBillDues) => {
      toast.remove();
      toast.success(`Updated ${data.name}.`);
      confetti({
        particleCount: 80,
      });
      setEditSubscriptionId(null, {
        scroll: false,
      });
      queryClient.invalidateQueries({ queryKey: [TANSTACK_QUERY_QUERY_KEY_SUBSCRIPTION_DETAILS] });
    },
    onError: (error: Error) => {
      toast.remove();
      toast.error(`Failed to update subscription. ${error.message}`);
    },
    gcTime: 1,
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
    mutate(data);
  };

  return (
    <Form { ...methods }>
      <form onSubmit={ methods.handleSubmit(onSubmit) } id="edit-subscription-content-form">
        { children }
      </form>
    </Form>
  );
}
