import { CardContent } from '@/components/ui/card';
import DisplayCard from '@/shared/components/DisplayCard';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import SearchTableHeaderDisplay from '@/shared/table/SearchTableHeaderDisplay';
import { Table, TableRow, TableBody, TableHeader } from '@/components/ui/table';
import BillsTableParentRow from '@/app/(base)/bills/_components/BillsTableParentRow';
import { SearchTableColumn, SEARCH_TABLE_COLUMN_IDS } from '@/shared/table/table.utils';

interface SubscriptionDetailsBillsTableProps {
  billDues: BillDueWithSubscription[];
}

export default function SubscriptionDetailsBillsTable({ billDues }: SubscriptionDetailsBillsTableProps) {
  const columnsSorted: SearchTableColumn[] = SEARCH_TABLE_COLUMN_IDS.sort((a, b) => a.ordinal - b.ordinal);

  return (
    <DisplayCard className="w-full py-0">
      <CardContent className="overflow-x-auto px-0">
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
                    sortData={ null }
                    pageId={ SORT_DATA_PAGE_IDS.search }
                  />
                );
              }) }
            </TableRow>
          </TableHeader>
          <TableBody>
            { billDues.map((billDue: BillDueWithSubscription) => (
              <BillsTableParentRow key={ billDue.id } billDue={ billDue } />
            )) }
          </TableBody>
        </Table>
      </CardContent>
    </DisplayCard>
  );
}
