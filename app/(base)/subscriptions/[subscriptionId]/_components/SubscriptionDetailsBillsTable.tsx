'use client';

import { CardContent } from '@/components/ui/card';
import DisplayCard from '@/shared/components/DisplayCard';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { upsertSortData2 } from '@/server/sort-data/sort-data.server';
import FormattedTableHeader from '@/shared/table/FormattedTableHeader';
import { SortDataUpsertable } from '@/models/sort-data/SortData.model';
import { BILLS_TABLE_COLUMNS } from '@/store/subscriptions/table.store';
import BillsTableParentRow from '@/shared/table/BillsDueTableParentRow';
import { Table, TableRow, TableBody, TableHeader } from '@/components/ui/table';

interface SubscriptionDetailsBillsTableProps {
  billDues: BillDueWithSubscription[];
}

export default function SubscriptionDetailsBillsTable({ billDues }: SubscriptionDetailsBillsTableProps) {
  const columnsSorted: string[] = [...BILLS_TABLE_COLUMNS] as string[];

  const handleOnSortUpdate = (sortDataToUpdate: SortDataUpsertable) => {
    upsertSortData2(sortDataToUpdate);
  };

  return (
    <DisplayCard className="w-full py-0">
      <CardContent className="overflow-x-auto px-0">
        <Table className="table-fixed">
          <TableHeader className={ `bg-muted` }>
            <TableRow className="hover:bg-transparent">
              { columnsSorted.map((column: string, index: number, array: string[]) => {
                return (
                  <FormattedTableHeader
                    tableId="bills"
                    key={ column }
                    columnId={ column }
                    index={ index }
                    length={ array.length }
                    sortData={ null }
                    pageId={ SORT_DATA_PAGE_IDS.subscriptionDetailsBillsBillsTable }
                    onSortUpdate={ handleOnSortUpdate }
                  />
                );
              }) }
            </TableRow>
          </TableHeader>
          <TableBody>
            { billDues.map((billDue: BillDueWithSubscription) => (
              <BillsTableParentRow key={ billDue.id } billDue={ billDue } columns={ columnsSorted } />
            )) }
          </TableBody>
        </Table>
      </CardContent>
    </DisplayCard>
  );
}
