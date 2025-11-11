import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { BillDueSearchParams } from '@/models/bills/bills.model';

import { isSearchParamsExist } from './dashboard.utils';
import BillsActionBarClearAllFilters from './BillsActionBarClearAllFilters';

interface Props {
  searchParams: BillDueSearchParams;
}

export default function BillsTableHasParamsSection({ searchParams }: Props) {
  const hasSearchParams: boolean = isSearchParamsExist(searchParams);

  if (hasSearchParams) {
    return (
      <>
        <Suspense fallback={ <ActionBarButtonSkeleton /> }>
          <BillsActionBarClearAllFilters />
        </Suspense>
        <Separator orientation="vertical" className="h-[1.2rem]!" />
      </>
    );
  }

  return null;
}

function ActionBarButtonSkeleton() {
  return <Skeleton className="h-9 w-[120px]" />;
}
