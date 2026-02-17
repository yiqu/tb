import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { unsortableBillsColumns } from '@/store/subscriptions/table.store';
import { Table, TableRow, TableBody, TableHeader } from '@/components/ui/table';
import { SortDataModel, SortDataPageId } from '@/models/sort-data/SortData.model';

import BillsTableParentRow from './BillsDueTableParentRow';
import SearchTableHeaderDisplay from './SearchTableHeaderDisplay';

interface BillsDueTableProps {
  billDues: BillDueWithSubscription[];
  columns: string[];
  sortData: SortDataModel;
  pageId: SortDataPageId;
  tableId?: string;
}

export default function BillsDueTable({ billDues, columns, sortData, pageId, tableId }: BillsDueTableProps) {
  return (
    <Table className="table-fixed" id={ tableId ?? 'bills-table' }>
      <TableHeader className={ `bg-muted` }>
        <TableRow className="hover:bg-transparent">
          { columns.map((column: string, index: number, array: string[]) => {
            return (
              <SearchTableHeaderDisplay
                key={ column }
                columnId={ column }
                index={ index }
                length={ array.length }
                sortData={ sortData }
                pageId={ pageId }
                sortable={ unsortableBillsColumns[column] ?? true }
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
