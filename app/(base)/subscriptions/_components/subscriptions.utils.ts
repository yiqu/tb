import z from 'zod';

import { subscriptionSearchParamsSchema } from '@/validators/subscriptions/subscriptions.schema';

/**
 * Check if there are search params. If it's only 'page', it's not considered as search params.
 */
export function isSearchParamsExist(searchParams: z.infer<typeof subscriptionSearchParamsSchema>) {
  const searchParamsKeys: string[] = Object.keys(searchParams);
  const hasSearchParams: boolean = searchParamsKeys.length > 0;

  if (searchParamsKeys.length === 1 && searchParamsKeys[0] === 'page') {
    return false;
  }

  return hasSearchParams;
}
