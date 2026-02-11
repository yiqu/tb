import z from 'zod';

import DisplayCard from '@/shared/components/DisplayCard';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { CardFooter, CardContent } from '@/components/ui/card';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import NoResultsCard from '@/components/status-cards/NoResultsCard';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { getAllOutstandingBillsCached } from '@/server/bills/bills.server';
import SearchTableHeaderDisplay from '@/shared/table/SearchTableHeaderDisplay';
import { Table, TableRow, TableBody, TableHeader } from '@/components/ui/table';
import { getSortDataForPageIdCached } from '@/server/sort-data/sort-data.server';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { SearchTableColumn, SEARCH_TABLE_COLUMN_IDS } from '@/shared/table/table.utils';
import { BillDueWithSubscription, BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';

import OutstandingBillsTableParentRow from './OutstandingBillsTableParentRow';
import DateRangeEpochButton from '../../_dashboard/_components/DateRangeEpochButton';

interface OutstandingBillsTableParentProps {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
  paginationPromise: Promise<PaginationDataModel | null>;
}

export default async function OutstandingBillsTableParent({ searchParamsPromise, paginationPromise }: OutstandingBillsTableParentProps) {
  const searchParams: z.infer<typeof billSearchParamsSchema> = await searchParamsPromise;
  const pagination: PaginationDataModel | null = await paginationPromise;
  const sortData: SortDataModel | null = await getSortDataForPageIdCached(SORT_DATA_PAGE_IDS.outstanding);
  const billDues: BillDueWithSubscriptionAndSortData = await getAllOutstandingBillsCached(sortData, pagination, searchParams);
  const columnsSorted: SearchTableColumn[] = SEARCH_TABLE_COLUMN_IDS.sort((a, b) => a.ordinal - b.ordinal);

  if (billDues.billDues.length === 0) {
    return (
      <div className="mt-6 flex w-full flex-col items-center justify-center gap-y-2">
        <NoResultsCard blendBg={ true } blendTextAreaBorder={ true } />
      </div>
    );
  }

  return (
    <DisplayCard className="w-full pt-0">
      <CardContent className="overflow-x-auto border-b px-0">
        <Table className="table-fixed">
          <TableHeader className={ `bg-muted` }>
            <TableRow className="hover:bg-transparent">
              { columnsSorted.map((column: SearchTableColumn, index: number, array: SearchTableColumn[]) => {
                return (
                  <SearchTableHeaderDisplay
                    key={ column.headerId }
                    columnId={ column.headerId }
                    index={ index }
                    length={ array.length }
                    sortData={ billDues.sortData }
                    pageId={ SORT_DATA_PAGE_IDS.outstanding }
                    sortable={ column.sortable ?? false }
                  />
                );
              }) }
            </TableRow>
          </TableHeader>
          <TableBody>
            { billDues.billDues.map((billDue: BillDueWithSubscription) => (
              <OutstandingBillsTableParentRow key={ billDue.id } billDue={ billDue } />
            )) }
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex w-full flex-row items-center justify-between">
        <div>
          <DateRangeEpochButton billDuesData={ billDues } />
        </div>
        <div></div>
      </CardFooter>
    </DisplayCard>
  );
}
