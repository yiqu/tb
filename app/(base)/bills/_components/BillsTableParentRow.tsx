'use client';

import BillsTableCell from '@/shared/table/SearchTableCellDisplay';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { BILLS_TABLE_COLUMNS, useColumnOrdinalObject } from '@/store/subscriptions/table.store';

import BillsTableParentRowWrapper from './BillsTableParentRowWrapper';

export default function BillsTableParentRow({ billDue }: { billDue: BillDueWithSubscription }) {
  const columnsOrderedByOrdinal = useColumnOrdinalObject('bills');
  const columnsSorted: string[] = [...BILLS_TABLE_COLUMNS].toSorted(
    (a: string, b: string) =>
      (columnsOrderedByOrdinal[a as keyof typeof columnsOrderedByOrdinal] ?? 0) -
      (columnsOrderedByOrdinal[b as keyof typeof columnsOrderedByOrdinal] ?? 0),
  );
  return (
    <BillsTableParentRowWrapper key={ billDue.id } billDue={ billDue }>
      { columnsSorted.map((column: string) => (
        <BillsTableCell key={ column } colId={ column } billDue={ billDue } showHoverFilter />
      )) }
    </BillsTableParentRowWrapper>
  );
}
