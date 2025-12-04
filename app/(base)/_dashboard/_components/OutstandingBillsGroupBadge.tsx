import { getOutstandingBillsCountForPriorMonthsCached } from '@/server/bills/bills.server';

import OutstandingBillsGroupBadgeClient from './OutstandingBillsGroupBadgeClient';

export default async function OutstandingBillsGroupBadge() {
  const outstandingCount = await getOutstandingBillsCountForPriorMonthsCached();

  return <OutstandingBillsGroupBadgeClient outstandingCount={ outstandingCount } />;
}
