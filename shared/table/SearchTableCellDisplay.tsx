import { TableCell } from '@/components/ui/table';
import Typography from '@/components/typography/Typography';
import { BillDueWithSubscription } from '@/models/bills/bills.model';

import DateDisplay from './DateDisplay';
import DateRelativeDisplay from './DateRelativeDisplay';

export default function SearchTableCell({ colId, billDue }: { colId: string; billDue: BillDueWithSubscription }) {
  if (colId === 'id') {
    return (
      <TableCell>
        <Typography className="truncate">{ billDue.id }</Typography>
      </TableCell>
    );
  }

  if (colId === 'dateAdded') {
    return (
      <TableCell>
        <DateRelativeDisplay time={ billDue.dateAdded } />
      </TableCell>
    );
  }

  if (colId === 'dueDate') {
    return (
      <TableCell>
        <div title={ `${new Date(Number.parseInt(billDue.dueDate)).toLocaleString()}` }>
          <DateRelativeDisplay time={ billDue.dueDate } />
          <DateDisplay date={ billDue.dueDate } />
        </div>
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
        <DateRelativeDisplay time={ billDue.updatedAt } />
      </TableCell>
    );
  }

  return (
    <TableCell>
      <span>N/A</span>
    </TableCell>
  );
}
