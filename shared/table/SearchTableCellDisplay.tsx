import { TableCell } from '@/components/ui/table';
import { BillDueWithSubscription } from '@/models/bills/bills.model';

export default function SearchTableCell({ colId, billDue }: { colId: string; billDue: BillDueWithSubscription }) {
  if (colId === 'id') {
    return (
      <TableCell>
        <span>{ billDue.id }</span>
      </TableCell>
    );
  }

  if (colId === 'dateAdded') {
    return (
      <TableCell>
        <span>TBD</span>
      </TableCell>
    );
  }

  if (colId === 'dueDate') {
    return (
      <TableCell>
        <span>TBD</span>
      </TableCell>
    );
  }

  if (colId === 'paid') {
    return (
      <TableCell>
        <span>TBD</span>
      </TableCell>
    );
  }

  if (colId === 'reimbursed') {
    return (
      <TableCell>
        <span>TBD</span>
      </TableCell>
    );
  }

  if (colId === 'subscription') {
    return (
      <TableCell>
        <span>TBD</span>
      </TableCell>
    );
  }

  if (colId === 'updatedAt') {
    return (
      <TableCell>
        <span>TBD</span>
      </TableCell>
    );
  }

  return (
    <TableCell>
      <span>N/A</span>
    </TableCell>
  );
}
