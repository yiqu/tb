import { Suspense } from 'react';

import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import EditBillForm from '@/components/bills/EditBillForm';
import LayoutPageContentWrapper from '@/components/layout/LayoutPageContentWrapper';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import ContentStickyByScrollWrapper from '@/components/layout/ContentStickyByScrollWrapper';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';
import LayoutContentActionPaginationWrapper from '@/components/layout/LayoutContentActionPaginationWrapper';

import BillsTableActionDialog from '../bills/_components/BillsTableActionDialog';
import OutstandingBillsTableParent from './_components/OutstandingBillsTableParent';
import OutstandingBillsTableSkeleton from './_components/OutstandingBillsTableSkeleton';
import OutstandingBillsTableActionBar from './_components/OutstandingBillsTableActionBar';
import OutstandingBillsTablePaginationWrapper from './_components/OutstandingBillsTablePaginationWrapper';

export default function OutstandingBillsPage({ searchParams }: PageProps<'/outstanding'>) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.outstanding);

  return (
    <LayoutPageContentWrapper>
      <ContentStickyByScrollWrapper threshold={ 120 } hideAnimation="slideUp">
        <LayoutContentActionPaginationWrapper>
          <OutstandingBillsTableActionBar />
          <OutstandingBillsTablePaginationWrapper searchParams={ searchParams } />
        </LayoutContentActionPaginationWrapper>
      </ContentStickyByScrollWrapper>

      <Suspense fallback={ <OutstandingBillsTableSkeleton /> }>
        <OutstandingBillsTableParent searchParamsPromise={ searchParams } paginationPromise={ paginationPromise } />
      </Suspense>
      <Suspense>
        <BillsTableActionDialog>
          <EditBillForm />
        </BillsTableActionDialog>
      </Suspense>
    </LayoutPageContentWrapper>
  );
}
