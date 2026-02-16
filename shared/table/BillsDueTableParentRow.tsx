import BillsTableCell from '@/shared/table/SearchTableCellDisplay';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import BillsTableParentRowWrapper from '@/app/(base)/bills/_components/BillsTableParentRowWrapper';

interface BillsTableParentRowProps {
  billDue: BillDueWithSubscription;
  columns: string[];
}

export default function BillsTableParentRow({ billDue, columns }: BillsTableParentRowProps) {
  return (
    <BillsTableParentRowWrapper key={ billDue.id } billDue={ billDue }>
      { columns.map((column: string) => (
        <BillsTableCell key={ column } colId={ column } billDue={ billDue } />
      )) }
    </BillsTableParentRowWrapper>
  );
}
