import BillsTableCell from '@/shared/table/SearchTableCellDisplay';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { BILLS_TABLE_COLUMNS } from '@/store/subscriptions/table.store';

import UpcomingBillsTableParentRowWrapper from './UpcomingBillsTableParentRowWrapper';

export default function UpcomingBillsTableParentRow({ billDue }: { billDue: BillDueWithSubscription }) {
  return (
    <UpcomingBillsTableParentRowWrapper key={ billDue.id } billDue={ billDue }>
      { BILLS_TABLE_COLUMNS.map((column: string) => (
        <BillsTableCell key={ column } colId={ column } billDue={ billDue } />
      )) }
    </UpcomingBillsTableParentRowWrapper>
  );
}
