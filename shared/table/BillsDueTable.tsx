import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { Table, TableRow, TableBody, TableHeader } from '@/components/ui/table';
import { SortDataModel, SortDataPageId } from '@/models/sort-data/SortData.model';

import { SearchTableColumn } from './table.utils';
import BillsTableParentRow from './BillsDueTableParentRow';
import SearchTableHeaderDisplay from './SearchTableHeaderDisplay';

interface BillsDueTableProps {
  billDues: BillDueWithSubscription[];
  columns: SearchTableColumn[];
  sortData: SortDataModel;
  pageId: SortDataPageId;
  tableId?: string;
}

export default function BillsDueTable({ billDues, columns, sortData, pageId, tableId }: BillsDueTableProps) {
  return (
    <Table className="table-fixed" id={ tableId ?? 'bills-table' }>
      <TableHeader className={ `bg-muted` }>
        <TableRow className="hover:bg-transparent">
          { columns.map((column: SearchTableColumn, index: number, array: SearchTableColumn[]) => {
            return (
              <SearchTableHeaderDisplay
                key={ column.headerId }
                columnId={ column.headerId }
                index={ index }
                length={ array.length }
                sortData={ sortData }
                pageId={ pageId }
                sortable={ column.sortable ?? false }
              />
            );
          }) }
        </TableRow>
      </TableHeader>
      <TableBody>
        { billDues.map((billDue: BillDueWithSubscription) => (
          <BillsTableParentRow key={ billDue.id } billDue={ billDue } columns={ columns } />
        )) }
      </TableBody>
    </Table>
  );
}
