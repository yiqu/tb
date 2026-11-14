import { Suspense } from 'react';

import EditBillForm from '@/components/bills/EditBillForm';
import LayoutPageContentWrapper from '@/components/layout/LayoutPageContentWrapper';
import ContentStickyByScrollWrapper from '@/components/layout/ContentStickyByScrollWrapper';
import LayoutContentActionPaginationWrapper from '@/components/layout/LayoutContentActionPaginationWrapper';

import YearlyBillsMonths from './_components/YearlyBillsMonths';
import YearlyBillsActionBar from './_components/YearlyBillsActionBar';
import YearlyBillsMonthsSkeleton from './_components/YearlyBillsMonthsSkeleton';
import BillsTableActionDialog from '../bills/_components/BillsTableActionDialog';

export default function YearlyBillsPage({ searchParams }: PageProps<'/yearly'>) {
  return (
    <LayoutPageContentWrapper>
      <ContentStickyByScrollWrapper threshold={ 120 } hideAnimation="slideUp">
        <LayoutContentActionPaginationWrapper>
          <YearlyBillsActionBar searchParamsPromise={ searchParams } />
        </LayoutContentActionPaginationWrapper>
      </ContentStickyByScrollWrapper>

      <Suspense fallback={ <YearlyBillsMonthsSkeleton /> }>
        <YearlyBillsMonths searchParamsPromise={ searchParams } />
      </Suspense>
      <Suspense>
        <BillsTableActionDialog>
          <EditBillForm />
        </BillsTableActionDialog>
      </Suspense>
    </LayoutPageContentWrapper>
  );
}
