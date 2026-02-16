/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
import { CardContent } from '@/components/ui/card';
import DisplayCard from '@/shared/components/DisplayCard';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { getAllBillsCached } from '@/server/bills/bills.server';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import SearchTableCell from '@/shared/table/SearchTableCellDisplay';
import { BILLS_TABLE_COLUMNS } from '@/store/subscriptions/table.store';
import SearchTableHeaderDisplay from '@/shared/table/SearchTableHeaderDisplay';
import { Table, TableRow, TableBody, TableHeader } from '@/components/ui/table';
import { getSortDataForPageIdCached } from '@/server/sort-data/sort-data.server';
import { BillDueWithSubscription, BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';

export default async function SearchTableParent() {
  const sortData: SortDataModel | null = await getSortDataForPageIdCached(SORT_DATA_PAGE_IDS.search);
  const billDues: BillDueWithSubscriptionAndSortData = await getAllBillsCached(sortData, null);
  const columnsSorted: string[] = BILLS_TABLE_COLUMNS;

  return (
    <DisplayCard className="w-full">
      <CardContent className="overflow-x-auto">
        <Table className={ `table-fixed` }>
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent">
              { columnsSorted.map((column: string, index: number, array: string[]) => {
                return (
                  <SearchTableHeaderDisplay
                    key={ column }
                    columnId={ column }
                    index={ index }
                    length={ array.length }
                    sortData={ billDues.sortData }
                    pageId={ SORT_DATA_PAGE_IDS.search }
                  />
                );
              }) }
            </TableRow>
          </TableHeader>
          <TableBody>
            { billDues.billDues.map((billDue: BillDueWithSubscription) => (
              <TableRow key={ billDue.id }>
                { BILLS_TABLE_COLUMNS.map((column: string) => (
                  <SearchTableCell key={ column } colId={ column } billDue={ billDue } />
                )) }
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </CardContent>
    </DisplayCard>
  );
}
