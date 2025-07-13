import z from 'zod';
import { Suspense } from 'react';

import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';

import BillsTableParent from './_components/BillsTableParent';
import BillsTableSkeleton from './_components/BillsTableSkeleton';
import BillsTableActionBar from './_components/BillsTableActionBar';
import BillsTablePaginationWrapper from './_components/BillsTablePaginationWrapper';

interface AllBillsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<z.infer<typeof billSearchParamsSchema>>;
}

export default function AllBillsPage({ searchParams }: AllBillsPageProps) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.search);

  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
      <BillsTableActionBar />
      <BillsTablePaginationWrapper searchParams={ searchParams } />
      <Suspense fallback={ <BillsTableSkeleton /> }>
        <BillsTableParent searchParamsPromise={ searchParams } paginationPromise={ paginationPromise } />
      </Suspense>
    </div>
  );
}
