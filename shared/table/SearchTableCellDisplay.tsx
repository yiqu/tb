/* eslint-disable prefer-destructuring */

import Link from 'next/link';
import Image from 'next/image';
import { DateTime } from 'luxon';
import startCase from 'lodash/startCase';

import { TableCell } from '@/components/ui/table';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { getUSDFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import CenterUnderline from '@/fancy/components/text/underline-center';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import DateDisplay from './DateDisplay';
import { getFrequencyImageUrl } from './table.utils';
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
        <div className={ `
          flex flex-row items-center justify-start gap-x-1
          sec:gap-x-1
          two:gap-x-6
        ` }>
          <Image
            src={ getFrequencyImageUrl(billDue.subscription.billCycleDuration) }
            alt="Frequency"
            width={ 22 }
            height={ 22 }
            className="opacity-90"
          />
          <Typography className="truncate">{ useFormatter.format(cost) }</Typography>
        </div>
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

  if (colId === 'frequency') {
    const freq: string = billDue.subscription.billCycleDuration;
    return (
      <TableCell>
        <Typography className="truncate">{ startCase(freq) }</Typography>
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
            <div
              title={ `${DateTime.fromMillis(Number.parseInt(billDue.dueDate)).setZone(EST_TIME_ZONE).toLocaleString(DateTime.DATETIME_MED)}` }
              className={ `
                flex cursor-pointer flex-col gap-y-1 truncate rounded-md border-1 border-transparent p-1 select-none
                hover:border-border hover:bg-accent
              ` }
            >
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
        <Link href={ `/subscriptions/${billDue.subscription.id}` } prefetch>
          <CenterUnderline label={ subName } />
        </Link>
      </TableCell>
    );
  }

  if (colId === 'updatedAt') {
    return (
      <TableCell>
        <Popover>
          <PopoverTrigger asChild>
            <div
              title={ `${DateTime.fromISO(new Date(billDue.updatedAt ?? '').toISOString())
                .setZone(EST_TIME_ZONE)
                .toLocaleString(DateTime.DATETIME_MED)}` }
              className={ `
                flex cursor-pointer flex-col gap-y-1 truncate rounded-md border-1 border-transparent p-1 select-none
                hover:border-border hover:bg-accent
              ` }
            >
              <DateDisplay date={ billDue.updatedAt } dateFormat="MM/dd/yy" />
              <DateRelativeDisplay time={ billDue.updatedAt } includeParenthesis />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <DateDialogContent
              dateString={ DateTime.fromISO(new Date(billDue.updatedAt ?? '').toISOString())
                .setZone(EST_TIME_ZONE)
                .toMillis()
                .toString() }
            />
          </PopoverContent>
        </Popover>
      </TableCell>
    );
  }

  if (colId === 'actions') {
    return (
      <TableCell className="">
        <div className="flex w-full flex-row items-center justify-start gap-x-1">
          <BillsTableEditBillButton billDue={ billDue } />
          <BillsTableDeleteBillButton billDue={ billDue } />
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
