'use client';

import BillsTableCell from '@/shared/table/SearchTableCellDisplay';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import useOrderedVisibleTableColumns from '@/hooks/table-columns-adjust/useOrderedVisibleTableColumns';

import BillsTableParentRowWrapper from './BillsTableParentRowWrapper';

export default function BillsTableParentRow({ billDue, showFilters = true }: { billDue: BillDueWithSubscription; showFilters?: boolean }) {
  const columnsSorted: string[] = useOrderedVisibleTableColumns('bills');
  return (
    <BillsTableParentRowWrapper key={ billDue.id } billDue={ billDue }>
      { columnsSorted.map((column: string, index: number) => (
        <BillsTableCell
          key={ column }
          colId={ column }
          billDue={ billDue }
          showHoverFilter={ showFilters }
          isSticky={ index === 0 }
        />
      )) }
    </BillsTableParentRowWrapper>
  );
}
