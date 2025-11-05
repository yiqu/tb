import z from 'zod';
import { queryOptions } from '@tanstack/react-query';

import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { subscriptionEditableSchema } from '@/validators/subscriptions/subscriptions.schema';
import {
  TANSTACK_QUERY_QUERY_KEY_ID_GENERAL,
  TANSTACK_QUERY_QUERY_KEY_SUBSCRIPTION_DETAILS,
  TANSTACK_QUERY_QUERY_KEY_SUBSCRIPTIONS_DETAILS,
} from '@/constants/constants';

import {
  updateSubscription,
  getSubscriptionWithBillDuesByIdUncached,
  getAllSubscriptionsWithBillDuesByIdsUncached,
} from '../subscriptions.server';

async function getSubscriptionById(subscriptionId: string): Promise<SubscriptionWithBillDues | null> {
  const res: SubscriptionWithBillDues | null = await getSubscriptionWithBillDuesByIdUncached(subscriptionId);
  return res;
}

async function getSubscriptionByIds(subscriptionIds: string[]): Promise<SubscriptionWithBillDues[]> {
  const res: SubscriptionWithBillDues[] = await getAllSubscriptionsWithBillDuesByIdsUncached(subscriptionIds);
  return res;
}

// TanStack Query options
export function getSubscriptionByIdQueryOptions(subscriptionId: string) {
  return queryOptions({
    queryKey: [
      TANSTACK_QUERY_QUERY_KEY_SUBSCRIPTION_DETAILS,
      {
        [TANSTACK_QUERY_QUERY_KEY_ID_GENERAL]: subscriptionId,
      },
    ],
    queryFn: getSubscriptionById.bind(null, subscriptionId),
    staleTime: 1000 * 1 * 60 * 15, // 15 minutes
  });
}

export function getSubscriptionsQueryOptions(subscriptionIds: string[]) {
  let idsObject = {};
  for (const id of subscriptionIds) {
    idsObject[id] = id;
  }
  return queryOptions({
    queryKey: [TANSTACK_QUERY_QUERY_KEY_SUBSCRIPTIONS_DETAILS, idsObject],
    queryFn: getSubscriptionByIds.bind(null, subscriptionIds),
    staleTime: 1000 * 1 * 60 * 15, // 15 minutes
  });
}

// ------------------------------ mutations ------------------------------

export function updateSubscriptionFn(
  subscriptionId: string,
  payload: z.infer<typeof subscriptionEditableSchema>,
): Promise<SubscriptionWithBillDues> {
  return updateSubscription(subscriptionId, payload);
}
