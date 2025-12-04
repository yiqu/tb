'use client';

import { useEffect } from 'react';

import { useBillStoreActions } from '@/store/bills/bills.store';

export default function OutstandingBillsGroupBadgeClient({ outstandingCount }: { outstandingCount: number }) {
  const { setOutstandingBillsAllTimeCount } = useBillStoreActions();

  useEffect(() => {
    setOutstandingBillsAllTimeCount(outstandingCount);
  }, [outstandingCount, setOutstandingBillsAllTimeCount]);

  return null;
}
