import BillsTableCell from '@/shared/table/SearchTableCellDisplay';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { SearchTableColumn, SEARCH_TABLE_COLUMN_IDS } from '@/shared/table/table.utils';

import BillsTableParentRowWrapper from './BillsTableParentRowWrapper';

export default function BillsTableParentRow({ billDue }: { billDue: BillDueWithSubscription }) {
  return (
    <BillsTableParentRowWrapper key={ billDue.id } billDue={ billDue }>
      { SEARCH_TABLE_COLUMN_IDS.map((column: SearchTableColumn) => (
        <BillsTableCell key={ column.headerId } colId={ column.headerId } billDue={ billDue } />
      )) }
    </BillsTableParentRowWrapper>
  );
}
