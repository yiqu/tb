import { CardContent } from '@/components/ui/card';
import { getAllBills } from '@/server/bills/bills.server';
import DisplayCard from '@/shared/components/DisplayCard';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import SearchTableCell from '@/shared/table/SearchTableCellDisplay';
import { getSortDataForPageId } from '@/server/sort-data/sort-data.server';
import SearchTableHeaderDisplay from '@/shared/table/SearchTableHeaderDisplay';
import { Table, TableRow, TableBody, TableHeader } from '@/components/ui/table';
import { SearchTableColumn, SEARCH_TABLE_COLUMN_IDS } from '@/shared/table/table.utils';
import { BillDueWithSubscription, BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';

export default async function SearchTableParent() {
  const sortData: SortDataModel | null = await getSortDataForPageId(SORT_DATA_PAGE_IDS.search);
  const billDues: BillDueWithSubscriptionAndSortData = await getAllBills(SORT_DATA_PAGE_IDS.search, sortData);

  return (
    <DisplayCard className="w-full">
      <CardContent>
        <Table>
          <TableHeader className="bg-background">
            <TableRow className="hover:bg-transparent">
              { SEARCH_TABLE_COLUMN_IDS.map((column: SearchTableColumn, index: number, array: SearchTableColumn[]) => (
                <SearchTableHeaderDisplay
                  key={ column.headerId }
                  columnId={ column.headerId }
                  index={ index }
                  length={ array.length }
                  sortData={ billDues.sortData }
                />
              )) }
            </TableRow>
          </TableHeader>
          <TableBody>
            { billDues.billDues.map((billDue: BillDueWithSubscription) => (
              <TableRow key={ billDue.id }>
                { SEARCH_TABLE_COLUMN_IDS.map((column: SearchTableColumn) => (
                  <SearchTableCell key={ column.headerId } colId={ column.headerId } billDue={ billDue } />
                )) }
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </CardContent>
    </DisplayCard>
  );
}
