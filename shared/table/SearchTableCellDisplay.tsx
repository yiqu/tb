/* eslint-disable prefer-destructuring */

import { TableCell } from '@/components/ui/table';
import { getUSDFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import DateDisplay from './DateDisplay';
import DateDialogContent from '../dialogs/DateDialog';
import DateRelativeDisplay from './DateRelativeDisplay';
import BillsTableEditBillButton from './BillsTableEditBillButton';
import BillsTableTogglePaidButton from './BillsTableTogglePaidButton';
import BillsTableDeleteBillButton from './BillsTableDeleteBillButton';
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
        <Typography className="truncate" title={ billDue.id }>
          { billDue.id }
        </Typography>
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
        <Popover>
          <PopoverTrigger asChild>
            <div title={ `${new Date(Number.parseInt(billDue.dueDate)).toLocaleString()}` } className={ `cursor-pointer truncate` }>
              <DateDisplay date={ billDue.dueDate } dateFormat="MM/dd/yy" />
              <DateRelativeDisplay time={ billDue.dueDate } includeParenthesis />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <DateDialogContent dateString={ billDue.dueDate } />
          </PopoverContent>
        </Popover>
      </TableCell>
    );
  }

  if (colId === 'paid') {
    const isPaid = !!billDue.paid;
    return (
      <TableCell>
        <BillsTableTogglePaidButton isPaid={ isPaid } billDueId={ billDue.id } />
      </TableCell>
    );
  }

  if (colId === 'reimbursed') {
    const isReimbursed = !!billDue.reimbursed;
    return (
      <TableCell>
        <BillsTableToggleReimbursedButton isReimbursed={ isReimbursed } billDueId={ billDue.id } />
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

  if (colId === 'actions') {
    return (
      <TableCell className="text-center">
        <div className="flex w-full flex-row items-center justify-center gap-x-1">
          <BillsTableEditBillButton billDue={ billDue } />
          <BillsTableDeleteBillButton />
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
