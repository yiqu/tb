import z from 'zod';

import { billSearchParamsSchema } from '@/validators/bills/bill.schema';

//const paramsToIgnore = ['editBillId', 'month', 'year', 'page'];

/**
 * Check if there are search params. If it's only 'page', it's not considered as search params.
 */
export function isSearchParamsExist(searchParams: z.infer<typeof billSearchParamsSchema>) {
  const searchParamsKeys: string[] = Object.keys(searchParams);
  const hasSearchParams: boolean = searchParamsKeys.length > 0;

  if (searchParamsKeys.length === 1 && searchParamsKeys[0] === 'editBillId') {
    return false;
  }

  if (searchParamsKeys.length === 2 && searchParamsKeys.includes('month') && searchParamsKeys.includes('year')) {
    return false;
  }

  if (
    searchParamsKeys.length === 3 &&
    searchParamsKeys.includes('month') &&
    searchParamsKeys.includes('year') &&
    searchParamsKeys.includes('page')
  ) {
    return false;
  }

  return hasSearchParams;
}
