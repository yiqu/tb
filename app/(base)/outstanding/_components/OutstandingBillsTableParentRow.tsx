import BillsTableCell from '@/shared/table/SearchTableCellDisplay';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { BILLS_TABLE_COLUMNS } from '@/store/subscriptions/table.store';

import OutstandingBillsTableParentRowWrapper from './OutstandingBillsTableParentRowWrapper';

export default function OutstandingBillsTableParentRow({ billDue }: { billDue: BillDueWithSubscription }) {
  return (
    <OutstandingBillsTableParentRowWrapper key={ billDue.id } billDue={ billDue }>
      { BILLS_TABLE_COLUMNS.map((column: string) => (
        <BillsTableCell key={ column } colId={ column } billDue={ billDue } />
      )) }
    </OutstandingBillsTableParentRowWrapper>
  );
}
