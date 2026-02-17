import { Suspense } from 'react';

import ColumnStack from '@/shared/components/ColumnStack';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import EditBillForm from '@/components/bills/EditBillForm';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import ContentStickyByScrollWrapper from '@/components/layout/ContentStickyByScrollWrapper';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';

import BillsTableParent from './_components/BillsTableParent';
import BillsTableSkeleton from './_components/BillsTableSkeleton';
import BillsTableActionBar from './_components/BillsTableActionBar';
import BillsTableActionDialog from './_components/BillsTableActionDialog';
import BillsTablePaginationWrapper from './_components/BillsTablePaginationWrapper';

export default function AllBillsPage({ searchParams }: PageProps<'/bills'>) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.search);

  return (
    <ColumnStack className="w-full gap-y-3">
      <ContentStickyByScrollWrapper threshold={ 120 } hideAnimation="slideUp">
        <ColumnStack className="w-full gap-y-3 py-3">
          <BillsTableActionBar />
          <BillsTablePaginationWrapper searchParams={ searchParams } />
        </ColumnStack>
      </ContentStickyByScrollWrapper>

      <Suspense fallback={ <BillsTableSkeleton /> }>
        <BillsTableParent searchParamsPromise={ searchParams } paginationPromise={ paginationPromise } />
      </Suspense>
      <Suspense>
        <BillsTableActionDialog>
          <EditBillForm />
        </BillsTableActionDialog>
      </Suspense>
    </ColumnStack>
  );
}
