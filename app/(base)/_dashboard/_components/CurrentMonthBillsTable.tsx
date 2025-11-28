import z from 'zod';
import { Suspense } from 'react';

import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import EditBillForm from '@/components/bills/EditBillForm';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';

import BillsTableParent from './BillsTableParent';
import BillsTablePaginationWrapper from './BillsTablePaginationWrapper';
import BillsTableSkeleton from '../../bills/_components/BillsTableSkeleton';
import BillsTableActionDialog from '../../bills/_components/BillsTableActionDialog';

type Props = {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
};

export default async function CurrentMonthBillsTable({ searchParamsPromise }: Props) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(
    SORT_DATA_PAGE_IDS.dashboard_current_month,
  );

  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
      <BillsTablePaginationWrapper searchParams={ searchParamsPromise } paginationBarStickyWrapperClassName="bg-card top-12" />
      <Suspense fallback={ <BillsTableSkeleton count={ 5 } className="h-full pb-6" /> }>
        <BillsTableParent searchParamsPromise={ searchParamsPromise } paginationPromise={ paginationPromise } />
      </Suspense>
      <Suspense>
        <BillsTableActionDialog>
          <EditBillForm />
        </BillsTableActionDialog>
      </Suspense>
    </div>
  );
}
