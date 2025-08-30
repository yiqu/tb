import { SearchTableColumn } from '@/shared/table/table.utils';
import BillsTableCell from '@/shared/table/SearchTableCellDisplay';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import BillsTableParentRowWrapper from '@/app/(base)/bills/_components/BillsTableParentRowWrapper';

interface BillsTableParentRowProps {
  billDue: BillDueWithSubscription;
  columns: SearchTableColumn[];
}

export default function BillsTableParentRow({ billDue, columns }: BillsTableParentRowProps) {
  return (
    <BillsTableParentRowWrapper key={ billDue.id } billDue={ billDue }>
      { columns.map((column: SearchTableColumn) => (
        <BillsTableCell key={ column.headerId } colId={ column.headerId } billDue={ billDue } />
      )) }
    </BillsTableParentRowWrapper>
  );
}
