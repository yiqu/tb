import z from 'zod';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import Typography from '@/components/typography/Typography';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { getSortDataForPageIdCached } from '@/server/sort-data/sort-data.server';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { BillSearchParams, billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { CurrentMonthDateData, BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';
import ContentPaginationBarStickyWrapper from '@/components/layout/ContentPaginationBarStickyWrapper';
import { getAllBillsCached, getCurrentMonthDateDataCached, getCurrentMonthBillsCountCached } from '@/server/bills/bills.server';

import { isSearchParamsExist } from './dashboard.utils';
import { appendMonthAndYearToSearchParams } from './dashboard.utils';
import BillsTableHasParamsSection from './BillsTableHasParamsSection';
import BillsTablePaginationPageSelect from './BillsTablePaginationPageSelect';
import BillsTablePaginationPageCountSelect from './BillsTablePaginationPageCountSelect';

interface BillsTablePaginationProps {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
  paginationPromise: Promise<PaginationDataModel | null>;
  paginationBarStickyWrapperClassName?: string;
}

export default async function BillsTablePagination({
  searchParamsPromise,
  paginationPromise,
  paginationBarStickyWrapperClassName,
}: BillsTablePaginationProps) {
  const dateData: CurrentMonthDateData = await getCurrentMonthDateDataCached();
  const dateParamsData: BillSearchParams = await dateData.dateSearchParamsPromise;
  const pagination: PaginationDataModel | null = await paginationPromise;

  let searchParams: BillSearchParams = await searchParamsPromise;
  const selectedMonthYearParams = searchParams.selectedMonthYear ?? `${dateParamsData.month}/${dateParamsData.year}`;
  const [selectedMonth, selectedYear] = selectedMonthYearParams.split('/');

  searchParams = appendMonthAndYearToSearchParams(searchParams, dateParamsData);

  const sortData: SortDataModel | null = await getSortDataForPageIdCached(SORT_DATA_PAGE_IDS.dashboard_current_month);
  const billDues: BillDueWithSubscriptionAndSortData = await getAllBillsCached(sortData, pagination, searchParams);

  const totalBillsCount: number = await getCurrentMonthBillsCountCached(selectedMonth, selectedYear);
  const billsCount = billDues.totalBillsCount;
  const startIndex = billDues.startIndex + 1;
  const { endIndex } = billDues;
  const { totalPages } = billDues;

  if (billsCount === 0) {
    return null;
  }

  const hasSearchParams: boolean = isSearchParamsExist(searchParams);

  return (
    <ContentPaginationBarStickyWrapper className={ paginationBarStickyWrapperClassName }>
      <div></div>
      <div className="flex flex-row items-center justify-end gap-x-4">
        <BillsTableHasParamsSection searchParams={ searchParams } />

        <div className="h-9">
          <BillsTablePaginationPageCountSelect>
            <Typography>
              { startIndex } - { endIndex } of { billsCount }{ ' ' }
              { hasSearchParams ?
                <span> ({ totalBillsCount })</span>
              : null }
            </Typography>
          </BillsTablePaginationPageCountSelect>
        </div>
        <Separator orientation="vertical" className="h-[1.2rem]!" />
        <Suspense fallback={ <PaginationSkeleton /> }>
          <BillsTablePaginationPageSelect pageCount={ totalPages } />
        </Suspense>
      </div>
    </ContentPaginationBarStickyWrapper>
  );
}

function PaginationSkeleton() {
  return <Skeleton className="h-9 w-[300px]" />;
}
