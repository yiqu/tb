import { queryOptions } from '@tanstack/react-query';

import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { TANSTACK_QUERY_QUERY_KEY_ID_GENERAL, TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS } from '@/constants/constants';

import { getBillDueById } from '../bills.server';

// Fetch functions
async function getBillById(billDueId: string): Promise<BillDueWithSubscription | null> {
  //delay
  //await new Promise((resolve) => setTimeout(resolve, 2_000));

  const res: BillDueWithSubscription | null = await getBillDueById(billDueId);
  return res;
}

// TanStack Query options
export function getBillDueByIdQueryOptions(billDueId: string) {
  return queryOptions({
    queryKey: [
      TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS,
      {
        [TANSTACK_QUERY_QUERY_KEY_ID_GENERAL]: billDueId,
      },
    ],
    queryFn: getBillById.bind(null, billDueId),
    staleTime: 1000 * 1 * 60 * 5, // 5 minutes
  });
}
