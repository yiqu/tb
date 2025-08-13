import { Suspense, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import Typography from '@/components/typography/Typography';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';

import UpcomingBillsTablePaginationPageCountSelectList from './UpcomingBillsTablePaginationPageCountSelectList';

export default function UpcomingBillsTablePaginationPageCountSelect({ children }: { children: ReactNode }) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.upcoming);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{ children }</Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-full flex-col gap-y-2">
        <Typography>Update page size</Typography>
        <Suspense fallback={ <BillsTablePaginationPageCountSelectSkeleton /> }>
          <UpcomingBillsTablePaginationPageCountSelectList paginationPromise={ paginationPromise } />
        </Suspense>
      </PopoverContent>
    </Popover>
  );
}

function BillsTablePaginationPageCountSelectSkeleton() {
  return <Skeleton className="h-9 w-[110px]" />;
}
