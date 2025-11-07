import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { BillDueSearchParams } from '@/models/bills/bills.model';

import { isSearchParamsExist } from './bills.utils';
import BillsActionBarClearAllFilters from './BillsActionBarClearAllFilters';
import BillsTableFavoriteSearchQueryButton from './BillsTableFavoriteSearchQueryButton';

interface Props {
  searchParams: BillDueSearchParams;
}

export default function BillsTableHasParamsSection({ searchParams }: Props) {
  const hasSearchParams: boolean = isSearchParamsExist(searchParams);

  if (hasSearchParams) {
    return (
      <>
        <BillsTableFavoriteSearchQueryButton searchParams={ searchParams } />
        <Separator orientation="vertical" className="h-[1.2rem]!" />
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
