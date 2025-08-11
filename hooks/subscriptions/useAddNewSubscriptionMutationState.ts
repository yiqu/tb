import z from 'zod';
import { MutationState, useMutationState } from '@tanstack/react-query';

import { TANSTACK_MUTATION_KEY_SUBSCRIPTION_CREATE } from '@/constants/constants';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { subscriptionAddableSchema } from '@/validators/subscriptions/subscriptions.schema';

export default function useAddNewSubscriptionMutationState(key = TANSTACK_MUTATION_KEY_SUBSCRIPTION_CREATE) {
  const mutationData = useMutationState({
    filters: { mutationKey: [key] },
    select: (mutation) =>
      mutation.state as MutationState<SubscriptionWithBillDues, Error, z.infer<typeof subscriptionAddableSchema>, undefined>,
  });
  const latestMutationData = mutationData[mutationData.length - 1];
  const isMutationPending = latestMutationData?.status === 'pending';
  const isMutationSuccess = latestMutationData?.status === 'success';
  const isMutationError = latestMutationData?.status === 'error';
  const resultData: SubscriptionWithBillDues | undefined = latestMutationData?.data;

  return {
    isMutationPending,
    isMutationSuccess,
    isMutationError,
    resultData,
  };
}
