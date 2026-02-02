'use client';

import { DateTime } from 'luxon';

import { EST_TIME_ZONE } from '@/lib/general.utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useClientOnly } from '@/hooks/useClientOnly';

import BillsActionBarDueDateFilter from '../../bills/_components/BillsActionBarDueDateFilter';

export default function BillsActionBarDueDateFilterParent() {
  const isClient = useClientOnly();

  if (!isClient) {
    return <ActionBarButtonSkeleton />;
  }

  const currentDateTime = DateTime.now().setZone(EST_TIME_ZONE);
  const currentYear = currentDateTime.year;

  return <BillsActionBarDueDateFilter showOnlyYears={ true } placeholderText="Year" defaultYear={ currentYear.toString() } />;
}

function ActionBarButtonSkeleton() {
  return <Skeleton className="h-9 w-[144px]" />;
}
