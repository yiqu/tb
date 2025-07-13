import z from 'zod';

import { CardContent } from '@/components/ui/card';
import DisplayCard from '@/shared/components/DisplayCard';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import EditBillForm from '@/components/bills/EditBillForm';
import { getAllBillsCached } from '@/server/bills/bills.server';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import BillsTableCell from '@/shared/table/SearchTableCellDisplay';
import NoResultsCard from '@/components/status-cards/NoResultsCard';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import SearchTableHeaderDisplay from '@/shared/table/SearchTableHeaderDisplay';
import { Table, TableRow, TableBody, TableHeader } from '@/components/ui/table';
import { getSortDataForPageIdCached } from '@/server/sort-data/sort-data.server';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { SearchTableColumn, SEARCH_TABLE_COLUMN_IDS } from '@/shared/table/table.utils';
import { BillDueWithSubscription, BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';

import BillsTableActionDialog from './BillsTableActionDialog';

interface BillsTableParentProps {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
  paginationPromise: Promise<PaginationDataModel | null>;
}

export default async function BillsTableParent({ searchParamsPromise, paginationPromise }: BillsTableParentProps) {
  const searchParams: z.infer<typeof billSearchParamsSchema> = await searchParamsPromise;
  const pagination: PaginationDataModel | null = await paginationPromise;
  const sortData: SortDataModel | null = await getSortDataForPageIdCached(SORT_DATA_PAGE_IDS.search);
  const billDues: BillDueWithSubscriptionAndSortData = await getAllBillsCached(sortData, pagination, searchParams);
  const columnsSorted: SearchTableColumn[] = SEARCH_TABLE_COLUMN_IDS.sort((a, b) => a.ordinal - b.ordinal);

  if (billDues.billDues.length === 0) {
    return (
      <div className="mt-6 flex w-full flex-col items-center justify-center gap-y-2">
        <NoResultsCard blendBg={ true } blendTextAreaBorder={ true } />
      </div>
    );
  }

  return (
    <DisplayCard className="w-full py-0">
      <CardContent className="overflow-x-auto px-0">
        <Table className={ `
          table-auto
          two:table-fixed
        ` }>
          <TableHeader className={ `
            bg-sidebar-accent/70
            dark:bg-sidebar-accent/100
          ` }>
            <TableRow className="hover:bg-transparent">
              { columnsSorted.map((column: SearchTableColumn, index: number, array: SearchTableColumn[]) => {
                return (
                  <SearchTableHeaderDisplay
                    key={ column.headerId }
                    columnId={ column.headerId }
                    index={ index }
                    length={ array.length }
                    sortData={ billDues.sortData }
                  />
                );
              }) }
            </TableRow>
          </TableHeader>
          <TableBody>
            { billDues.billDues.map((billDue: BillDueWithSubscription) => (
              <TableRow key={ billDue.id } className="hover:bg-muted/20">
                { SEARCH_TABLE_COLUMN_IDS.map((column: SearchTableColumn) => (
                  <BillsTableCell key={ column.headerId } colId={ column.headerId } billDue={ billDue } />
                )) }
              </TableRow>
            )) }
          </TableBody>
        </Table>

        <BillsTableActionDialog>
          <EditBillForm />
        </BillsTableActionDialog>
      </CardContent>
    </DisplayCard>
  );
}
