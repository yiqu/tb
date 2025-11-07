import { Suspense } from 'react';

import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import EditBillForm from '@/components/bills/EditBillForm';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';

import UpcomingBillsTableParent from './_components/UpcomingBillsTableParent';
import BillsTableActionDialog from '../bills/_components/BillsTableActionDialog';
import UpcomingBillsTableSkeleton from './_components/UpcomingBillsTableSkeleton';
import UpcomingBillsTableActionBar from './_components/UpcomingBillsTableActionBar';
import UpcomingBillsTablePaginationWrapper from './_components/UpcomingBillsTablePaginationWrapper';

export default function UpcomingBillsPage({ searchParams }: PageProps<'/upcoming'>) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.upcoming);

  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
      <UpcomingBillsTableActionBar />
      <UpcomingBillsTablePaginationWrapper searchParams={ searchParams } />
      <Suspense fallback={ <UpcomingBillsTableSkeleton /> }>
        <UpcomingBillsTableParent searchParamsPromise={ searchParams } paginationPromise={ paginationPromise } />
      </Suspense>
      <Suspense>
        <BillsTableActionDialog>
          <EditBillForm />
        </BillsTableActionDialog>
      </Suspense>
    </div>
  );
}
