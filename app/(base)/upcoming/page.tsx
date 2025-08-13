import z from 'zod';
import { Suspense } from 'react';

import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import EditBillForm from '@/components/bills/EditBillForm';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';

import UpcomingBillsTableParent from './_components/UpcomingBillsTableParent';
import UpcomingBillsTableSkeleton from './_components/UpcomingBillsTableSkeleton';
import UpcomingBillsTableActionBar from './_components/UpcomingBillsTableActionBar';
import UpcomingBillsTableActionDialog from './_components/UpcomingBillsTableActionDialog';
import UpcomingBillsTablePaginationWrapper from './_components/UpcomingBillsTablePaginationWrapper';

interface UpcomingBillsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<z.infer<typeof billSearchParamsSchema>>;
}

export default function UpcomingBillsPage({ searchParams }: UpcomingBillsPageProps) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.upcoming);

  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
      <UpcomingBillsTableActionBar />
      <UpcomingBillsTablePaginationWrapper searchParams={ searchParams } />
      <Suspense fallback={ <UpcomingBillsTableSkeleton /> }>
        <UpcomingBillsTableParent searchParamsPromise={ searchParams } paginationPromise={ paginationPromise } />
      </Suspense>
      <Suspense>
        <UpcomingBillsTableActionDialog>
          <EditBillForm />
        </UpcomingBillsTableActionDialog>
      </Suspense>
    </div>
  );
}
