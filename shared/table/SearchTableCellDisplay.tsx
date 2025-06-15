/* eslint-disable prefer-destructuring */
import { TableCell } from '@/components/ui/table';
import { getUSDFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import { BillDueWithSubscription } from '@/models/bills/bills.model';

import DateDisplay from './DateDisplay';
import DateRelativeDisplay from './DateRelativeDisplay';
import BillsTableTogglePaidButton from './BillsTableTogglePaidButton';
import BillsTableToggleReimbursedButton from './BillsTableToggleReimbursedButton';

const useFormatter = getUSDFormatter(2, 2);

export default function BillsTableCell({ colId, billDue }: { colId: string; billDue: BillDueWithSubscription }) {
  if (colId === 'cost') {
    let { cost } = billDue;

    if (cost === null || cost === undefined) {
      cost = billDue.subscription.cost;
    }

    return (
      <TableCell>
        <Typography className="truncate">{ useFormatter.format(cost) }</Typography>
      </TableCell>
    );
  }

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
        <div title={ `${billDue.dateAdded}` } className="truncate">
          <DateDisplay date={ billDue.dateAdded } dateFormat="MM/dd/yy" />
        </div>
      </TableCell>
    );
  }

  if (colId === 'dueDate') {
    return (
      <TableCell>
        <div title={ `${new Date(Number.parseInt(billDue.dueDate)).toLocaleString()}` } className="truncate">
          <DateRelativeDisplay time={ billDue.dueDate } />
          <DateDisplay date={ billDue.dueDate } dateFormat="MM/dd/yy" />
        </div>
      </TableCell>
    );
  }

  if (colId === 'paid') {
    const isPaid = !!billDue.paid;
    return (
      <TableCell>
        <BillsTableTogglePaidButton isPaid={ isPaid } />
      </TableCell>
    );
  }

  if (colId === 'reimbursed') {
    const isReimbursed = !!billDue.reimbursed;
    return (
      <TableCell>
        <BillsTableToggleReimbursedButton isReimbursed={ isReimbursed } />
      </TableCell>
    );
  }

  if (colId === 'subscription') {
    const subName = billDue.subscription.name;
    return (
      <TableCell>
        <Typography className="truncate">{ subName }</Typography>
      </TableCell>
    );
  }

  if (colId === 'updatedAt') {
    return (
      <TableCell>
        <div title={ `${billDue.updatedAt}` } className="truncate">
          <DateDisplay date={ billDue.updatedAt } dateFormat="MM/dd/yy" />
        </div>
      </TableCell>
    );
  }

  return (
    <TableCell>
      <span>N/A</span>
    </TableCell>
  );
}
