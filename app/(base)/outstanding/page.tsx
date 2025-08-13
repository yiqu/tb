import z from 'zod';
import { Suspense } from 'react';

import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import EditBillForm from '@/components/bills/EditBillForm';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';

import OutstandingBillsTableParent from './_components/OutstandingBillsTableParent';
import OutstandingBillsTableSkeleton from './_components/OutstandingBillsTableSkeleton';
import OutstandingBillsTableActionBar from './_components/OutstandingBillsTableActionBar';
import OutstandingBillsTableActionDialog from './_components/OutstandingBillsTableActionDialog';
import OutstandingBillsTablePaginationWrapper from './_components/OutstandingBillsTablePaginationWrapper';

interface OutstandingBillsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<z.infer<typeof billSearchParamsSchema>>;
}

export default function OutstandingBillsPage({ searchParams }: OutstandingBillsPageProps) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.outstanding);

  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
      <OutstandingBillsTableActionBar />
      <OutstandingBillsTablePaginationWrapper searchParams={ searchParams } />
      <Suspense fallback={ <OutstandingBillsTableSkeleton /> }>
        <OutstandingBillsTableParent searchParamsPromise={ searchParams } paginationPromise={ paginationPromise } />
      </Suspense>
      <Suspense>
        <OutstandingBillsTableActionDialog>
          <EditBillForm />
        </OutstandingBillsTableActionDialog>
      </Suspense>
    </div>
  );
}
