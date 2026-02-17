import { Suspense } from 'react';

import ColumnStack from '@/shared/components/ColumnStack';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import EditBillForm from '@/components/bills/EditBillForm';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import ContentStickyByScrollWrapper from '@/components/layout/ContentStickyByScrollWrapper';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';

import UpcomingBillsTableParent from './_components/UpcomingBillsTableParent';
import BillsTableActionDialog from '../bills/_components/BillsTableActionDialog';
import UpcomingBillsTableSkeleton from './_components/UpcomingBillsTableSkeleton';
import UpcomingBillsTableActionBar from './_components/UpcomingBillsTableActionBar';
import UpcomingBillsTablePaginationWrapper from './_components/UpcomingBillsTablePaginationWrapper';

export default function UpcomingBillsPage({ searchParams }: PageProps<'/upcoming'>) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.upcoming);

  return (
    <ColumnStack className="w-full gap-y-3">
      <ContentStickyByScrollWrapper threshold={ 120 } hideAnimation="slideUp">
        <ColumnStack className="w-full gap-y-3 py-3">
          <UpcomingBillsTableActionBar />
          <UpcomingBillsTablePaginationWrapper searchParams={ searchParams } />
        </ColumnStack>
      </ContentStickyByScrollWrapper>

      <Suspense fallback={ <UpcomingBillsTableSkeleton /> }>
        <UpcomingBillsTableParent searchParamsPromise={ searchParams } paginationPromise={ paginationPromise } />
      </Suspense>
      <Suspense>
        <BillsTableActionDialog>
          <EditBillForm />
        </BillsTableActionDialog>
      </Suspense>
    </ColumnStack>
  );
}
