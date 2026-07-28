'use client';

import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { upsertSortData2 } from '@/server/sort-data/sort-data.server';
import { unsortableBillsColumns } from '@/store/subscriptions/table.store';
import { Table, TableRow, TableBody, TableHeader } from '@/components/ui/table';
import { SortDataModel, SortDataPageId, SortDataUpsertable } from '@/models/sort-data/SortData.model';

import FormattedTableHeader from './FormattedTableHeader';
import BillsTableParentRow from './BillsDueTableParentRow';
import FormattedTableHeadFiller from './FormattedTableHeadFiller';

interface BillsDueTableProps {
  billDues: BillDueWithSubscription[];
  columns: string[];
  sortData: SortDataModel;
  pageId: SortDataPageId;
  tableId?: string;
}

export default function BillsDueTable({ billDues, columns, sortData, pageId, tableId }: BillsDueTableProps) {
  const handleOnSortUpdate = (sortDataToUpdate: SortDataUpsertable) => {
    upsertSortData2(sortDataToUpdate);
  };

  return (
    <Table className="table-fixed" id={ tableId ?? 'bills-table' }>
      <TableHeader className={ `bg-muted` }>
        <TableRow className="hover:bg-transparent">
          { columns.map((column: string, index: number) => {
            return (
              <FormattedTableHeader
                tableId="bills"
                key={ column }
                columnId={ column }
                index={ index }
                sortData={ sortData }
                pageId={ pageId }
                sortable={ unsortableBillsColumns[column] ?? true }
                onSortUpdate={ handleOnSortUpdate }
              />
            );
          }) }
          <FormattedTableHeadFiller />
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
