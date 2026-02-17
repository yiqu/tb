/* eslint-disable prefer-destructuring */

import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import startCase from 'lodash/startCase';

import { TableCell } from '@/components/ui/table';
import { getUSDFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import SubscriptionLogo from '@/components/logos/SubscriptionLogo';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import EditBillDialogFavoriteBillToggleButton from '@/components/bills/EditBillDialogFavoriteBillToggleButton';

import RowStack from '../components/RowStack';
import DateDialogContent from '../dialogs/DateDialog';
import DateRelativeDisplay from './DateRelativeDisplay';
import DateDialogContentBase from '../dialogs/DateDialogBase';
import { TableCellHoverWrapper } from './TableCellHoverWrapper';
import BillsTableEditBillButton from './BillsTableEditBillButton';
import BillsTableTogglePaidButton from './BillsTableTogglePaidButton';
import BillsTableDeleteBillButton from './BillsTableDeleteBillButton';
import { getFrequencyImageUrl, getSubscriptionLogoSize } from './table.utils';
import BillsTableToggleReimbursedButton from './BillsTableToggleReimbursedButton';
import SearchTableCellDisplayDueDateIcon from './SearchTableCellDisplayDueDateIcon';

const useFormatter = getUSDFormatter(2, 2);

export default function BillsTableCell({
  colId,
  billDue,
  showHoverFilter,
}: {
  colId: string;
  billDue: BillDueWithSubscription;
  showHoverFilter?: boolean;
}) {
  if (colId === 'cost') {
    let { cost } = billDue;

    if (cost === null || cost === undefined) {
      cost = billDue.subscription.cost;
    }

    const isFavorited: boolean = (billDue.favorites ?? []).length > 0;

    return (
      <TableCell>
        <div className={ `
          flex flex-row items-center justify-between gap-x-1
          sec:gap-x-1
          two:gap-x-6
        ` }>
          <Link href={ `/bills/${billDue.id}` } prefetch={ true }>
            <Typography className="wrap-break-word tabular-nums">{ useFormatter.format(cost) }</Typography>
          </Link>
          <div>
            { isFavorited ?
              <EditBillDialogFavoriteBillToggleButton billDue={ billDue } buttonProps={ { variant: 'ghost' } } buttonClassName="size-6" />
            : null }
          </div>
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
      <TableCellHoverWrapper payload={ freq } columnId={ colId } showHoverFilter={ showHoverFilter }>
        <TableCell>
          <div className={ `
            flex flex-row items-center justify-start gap-x-1
            sec:gap-x-1
            two:gap-x-2
          ` }>
            <Image
              src={ getFrequencyImageUrl(billDue.subscription.billCycleDuration) }
              alt="Frequency"
              width={ 22 }
              height={ 22 }
              className="opacity-90 select-none"
            />
            <Typography className="truncate">{ startCase(freq) }</Typography>
          </div>
        </TableCell>
      </TableCellHoverWrapper>
    );
  }

  if (colId === 'dateAdded') {
    return (
      <TableCell className="wrap-break-word whitespace-normal">
        <Popover>
          <PopoverTrigger asChild>
            <div
              title={ `${billDue.dateAdded}` }
              className={ `
                flex cursor-pointer flex-col gap-y-1 rounded-md border border-transparent p-1 select-none
                hover:border-border hover:bg-background
              ` }
            >
              <Typography className="wrap-break-word">{ billDue.dateAddedInEst }</Typography>
              <DateRelativeDisplay
                time={ billDue.dateAdded as any }
                largest={ 2 }
                updateInterval={ 60_000 }
                useShortText={ true }
                overrideHideSeconds={ true }
              />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Suspense>
              <DateDialogContent dateTime={ billDue.dateAdded } />
            </Suspense>
          </PopoverContent>
        </Popover>
      </TableCell>
    );
  }

  if (colId === 'dueDate') {
    const dueDate: string | undefined = billDue.dueDateInEst;
    const isCompleted = billDue.reimbursed && billDue.paid;
    return (
      <TableCell className="wrap-break-word whitespace-normal">
        <Popover>
          <PopoverTrigger asChild>
            <div
              className={ `
                flex cursor-pointer flex-col gap-y-1 rounded-md border border-transparent p-1 select-none
                hover:border-border hover:bg-background
              ` }
            >
              <div className="flex flex-row items-center justify-start gap-x-2">
                <Typography className="wrap-break-word">{ dueDate }</Typography>
                <SearchTableCellDisplayDueDateIcon date={ billDue.dueDate } billDue={ billDue } />
              </div>
              <DateRelativeDisplay time={ billDue.dueDate as any } className="wrap-break-word" isCompleted={ isCompleted } />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Suspense>
              <DateDialogContentBase dateString={ billDue.dueDate } />
            </Suspense>
          </PopoverContent>
        </Popover>
      </TableCell>
    );
  }

  if (colId === 'paid') {
    const isPaid = !!billDue.paid;
    return (
      <TableCellHoverWrapper payload={ 'paid-only' } columnId={ 'paymentStatus' } showHoverFilter={ showHoverFilter }>
        <TableCell>
          <BillsTableTogglePaidButton isPaid={ isPaid } billDueId={ billDue.id } subscriptionId={ billDue.subscriptionId } />
        </TableCell>
      </TableCellHoverWrapper>
    );
  }

  if (colId === 'reimbursed') {
    const isReimbursed = !!billDue.reimbursed;
    return (
      <TableCellHoverWrapper payload={ 'reimbursed-only' } columnId={ 'paymentStatus' } showHoverFilter={ showHoverFilter }>
        <TableCell>
          <BillsTableToggleReimbursedButton isReimbursed={ isReimbursed } billDueId={ billDue.id } subscriptionId={ billDue.subscriptionId } />
        </TableCell>
      </TableCellHoverWrapper>
    );
  }

  if (colId === 'subscription') {
    const subName = billDue.subscription.name;
    return (
      <TableCellHoverWrapper payload={ billDue.subscription.id } columnId={ 'subscriptions' } showHoverFilter={ showHoverFilter }>
        <TableCell className="overflow-hidden whitespace-normal">
          <Link href={ `/subscriptions/${billDue.subscription.id}` as any } prefetch={ true }>
            <RowStack className="min-w-0 items-center justify-start gap-x-2">
              <SubscriptionLogo subscriptionName={ subName } height={ getSubscriptionLogoSize(subName) } />
              <Typography className="wrap-break-word">{ subName }</Typography>
            </RowStack>
          </Link>
        </TableCell>
      </TableCellHoverWrapper>
    );
  }

  if (colId === 'updatedAt') {
    return (
      <TableCell className="wrap-break-word whitespace-normal">
        <Popover>
          <PopoverTrigger asChild>
            <div
              title={ `${billDue.updatedAt}` }
              className={ `
                flex cursor-pointer flex-col gap-y-1 rounded-md border border-transparent p-1 select-none
                hover:border-border hover:bg-background
              ` }
            >
              { `${billDue.updatedAt}` === `${billDue.dateAdded}` ?
                <Typography variant="nodata1">N/A</Typography>
              : <>
                <Typography className="wrap-break-word">{ billDue.updatedAtInEst }</Typography>
                <DateRelativeDisplay
                    time={ billDue.updatedAt as any }
                    largest={ 2 }
                    updateInterval={ 60_000 }
                    useShortText={ true }
                    overrideHideSeconds={ true }
                  />
              </>
              }
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Suspense>
              <DateDialogContent dateTime={ billDue.updatedAt } />
            </Suspense>
          </PopoverContent>
        </Popover>
      </TableCell>
    );
  }

  if (colId === 'tableActions') {
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
