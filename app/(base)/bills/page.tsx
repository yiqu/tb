import { Suspense } from 'react';

import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import EditBillForm from '@/components/bills/EditBillForm';
import BillsTableLoading from '@/shared/loading/BillsTableLoading';
import LayoutPageContentWrapper from '@/components/layout/LayoutPageContentWrapper';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import ContentStickyByScrollWrapper from '@/components/layout/ContentStickyByScrollWrapper';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';
import LayoutContentActionPaginationWrapper from '@/components/layout/LayoutContentActionPaginationWrapper';

import BillsTableParent from './_components/BillsTableParent';
import BillsTableActionBar from './_components/BillsTableActionBar';
import BillsTableActionDialog from './_components/BillsTableActionDialog';
import BillsTablePaginationWrapper from './_components/BillsTablePaginationWrapper';

export default function AllBillsPage({ searchParams }: PageProps<'/bills'>) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.search);

  return (
    <LayoutPageContentWrapper>
      <ContentStickyByScrollWrapper threshold={ 120 } hideAnimation="slideUp">
        <LayoutContentActionPaginationWrapper>
          <BillsTableActionBar />
          <BillsTablePaginationWrapper searchParams={ searchParams } />
        </LayoutContentActionPaginationWrapper>
      </ContentStickyByScrollWrapper>

      <Suspense fallback={ <BillsTableLoading rowCount={ 15 } /> }>
        <BillsTableParent searchParamsPromise={ searchParams } paginationPromise={ paginationPromise } />
      </Suspense>
      <Suspense>
        <BillsTableActionDialog>
          <EditBillForm />
        </BillsTableActionDialog>
      </Suspense>
    </LayoutPageContentWrapper>
  );
}
