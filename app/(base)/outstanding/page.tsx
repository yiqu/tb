import { Suspense } from 'react';

import ColumnStack from '@/shared/components/ColumnStack';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import EditBillForm from '@/components/bills/EditBillForm';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import ContentStickyByScrollWrapper from '@/components/layout/ContentStickyByScrollWrapper';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';

import BillsTableActionDialog from '../bills/_components/BillsTableActionDialog';
import OutstandingBillsTableParent from './_components/OutstandingBillsTableParent';
import OutstandingBillsTableSkeleton from './_components/OutstandingBillsTableSkeleton';
import OutstandingBillsTableActionBar from './_components/OutstandingBillsTableActionBar';
import OutstandingBillsTablePaginationWrapper from './_components/OutstandingBillsTablePaginationWrapper';

export default function OutstandingBillsPage({ searchParams }: PageProps<'/outstanding'>) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.outstanding);

  return (
    <ColumnStack className="w-full gap-y-3">
      <ContentStickyByScrollWrapper threshold={ 120 } hideAnimation="slideUp">
        <ColumnStack className="w-full gap-y-3 py-3">
          <OutstandingBillsTableActionBar />
          <OutstandingBillsTablePaginationWrapper searchParams={ searchParams } />
        </ColumnStack>
      </ContentStickyByScrollWrapper>

      <Suspense fallback={ <OutstandingBillsTableSkeleton /> }>
        <OutstandingBillsTableParent searchParamsPromise={ searchParams } paginationPromise={ paginationPromise } />
      </Suspense>
      <Suspense>
        <BillsTableActionDialog>
          <EditBillForm />
        </BillsTableActionDialog>
      </Suspense>
    </ColumnStack>
  );
}
