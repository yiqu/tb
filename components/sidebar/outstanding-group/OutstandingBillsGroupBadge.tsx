import { cacheTag, cacheLife } from 'next/cache';

import { Badge } from '@/components/ui/badge';
import { CACHE_TAG_BILL_DUES_OUTSTANDING_PRIOR_MONTHS } from '@/constants/constants';
import { getOutstandingBillsCountForPriorMonthsCached } from '@/server/bills/bills.server';

export default async function OutstandingBillsGroupBadge() {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_BILL_DUES_OUTSTANDING_PRIOR_MONTHS);

  const outstandingCount = await getOutstandingBillsCountForPriorMonthsCached();

  if (outstandingCount === 0) {
    return null;
  }

  return (
    <Badge
      className={ `
        relative bottom-3 -ml-2 rounded-full font-semibold text-red-700 tabular-nums
        dark:text-red-400
      ` }
      variant="secondary"
      title="Not paid or not reimbursed bills"
    >
      { outstandingCount }
    </Badge>
  );
}
