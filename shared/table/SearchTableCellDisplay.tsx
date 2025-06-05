import { TableCell } from '@/components/ui/table';
import { BillDueWithSubscription } from '@/models/bills/bills.model';

export default function SearchTableCell({ colId, billDue }: { colId: string; billDue: BillDueWithSubscription }) {
  if (colId === 'id') {
    return <TableCell>{ billDue.id }</TableCell>;
  }

  if (colId === 'dateAdded') {
    return <TableCell>TBD</TableCell>;
  }

  if (colId === 'dueDate') {
    return <TableCell>{ billDue.dueDate }</TableCell>;
  }

  if (colId === 'paid') {
    return <TableCell>{ billDue.paid }</TableCell>;
  }

  if (colId === 'reimbursed') {
    return <TableCell>{ billDue.reimbursed }</TableCell>;
  }

  if (colId === 'subscription') {
    return <TableCell>TBD</TableCell>;
  }

  if (colId === 'updatedAt') {
    return <TableCell>TBD</TableCell>;
  }
}
