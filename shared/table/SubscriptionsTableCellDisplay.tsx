/* eslint-disable prefer-destructuring */

import Link from 'next/link';
import Image from 'next/image';
import { DateTime } from 'luxon';
import startCase from 'lodash/startCase';
import { ExternalLinkIcon } from 'lucide-react';

import { TableCell } from '@/components/ui/table';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { getUSDFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import SubscriptionLogo from '@/components/logos/SubscriptionLogo';
import CenterUnderline from '@/fancy/components/text/underline-center';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import SubscriptionsTableEditBillButton from '@/app/(base)/subscriptions/_components/SubscriptionsTableEditButton';

import DateDisplay from './DateDisplay';
import { getFrequencyImageUrl } from './table.utils';
import DateDialogContent from '../dialogs/DateDialog';
import DateRelativeDisplay from './DateRelativeDisplay';
import SubscriptionsTableToggleSignedButton from './SubscriptionsTableToggleSignedButton';
import SubscriptionsTableToggleApprovedButton from './SubscriptionsTableToggleApprovedButton';
import SubscriptionsTableCellDisplayCurrentYearCount from './SubscriptionsTableCellDisplayCurrentYearCount';

const useFormatter = getUSDFormatter(2, 2);

export default function SubscriptionsTableCellDisplay({ colId, subscription }: { colId: string; subscription: SubscriptionWithBillDues }) {
  if (colId === 'cost') {
    let { cost } = subscription;

    if (cost === null || cost === undefined) {
      cost = subscription.cost;
    }

    return (
      <TableCell>
        <div className={ `
          flex flex-row items-center justify-start gap-x-1
          sec:gap-x-1
          two:gap-x-6
        ` }>
          <Typography className="truncate">{ useFormatter.format(cost) }</Typography>
        </div>
      </TableCell>
    );
  }

  if (colId === 'id') {
    return (
      <TableCell>
        <Typography className="truncate" title={ subscription.id }>
          { subscription.id }
        </Typography>
      </TableCell>
    );
  }

  if (colId === 'description') {
    return (
      <TableCell>
        <Typography
          className="text-wrap break-words"
          title={ subscription.description ?? 'N/A' }
          variant={ subscription.description ? 'labelvalue1' : 'nodata1' }
        >
          { subscription.description ? subscription.description : 'N/A' }
        </Typography>
      </TableCell>
    );
  }

  if (colId === 'url') {
    if (!subscription.url) {
      return (
        <TableCell>
          <Typography className="truncate" variant="nodata1">
            N/A
          </Typography>
        </TableCell>
      );
    }

    // wrap text to next line if it is too long
    return (
      <TableCell>
        <Link href={ subscription.url ?? '' } target="_blank" rel="noopener noreferrer">
          <div className="flex flex-row items-start justify-start gap-x-1 text-wrap">
            <Typography className="break-all" title={ subscription.url ?? 'N/A' }>
              { subscription.url }
            </Typography>
            <ExternalLinkIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
          </div>
        </Link>
      </TableCell>
    );
  }

  if (colId === 'billCycleDuration') {
    const freq: string = subscription.billCycleDuration;
    return (
      <TableCell>
        <div className={ `
          flex flex-row items-center justify-start gap-x-1
          sec:gap-x-1
          two:gap-x-2
        ` }>
          <Image
            src={ getFrequencyImageUrl(subscription.billCycleDuration) }
            alt="Frequency"
            width={ 22 }
            height={ 22 }
            className={ `opacity-90` }
          />

          <Typography className="truncate">{ startCase(freq) }</Typography>
        </div>
      </TableCell>
    );
  }

  if (colId === 'dateAdded') {
    return (
      <TableCell>
        <div title={ `${subscription.dateAdded}` } className="truncate">
          <DateDisplay date={ subscription.dateAdded } dateFormat="MM/dd/yy" />
        </div>
      </TableCell>
    );
  }

  if (colId === 'approved') {
    const isApproved = !!subscription.approved;
    return (
      <TableCell>
        <SubscriptionsTableToggleApprovedButton isApproved={ isApproved } subscriptionId={ subscription.id } />
      </TableCell>
    );
  }

  if (colId === 'signed') {
    const isSigned = !!subscription.signed;
    return (
      <TableCell>
        <SubscriptionsTableToggleSignedButton isSigned={ isSigned } subscriptionId={ subscription.id } />
      </TableCell>
    );
  }

  if (colId === 'name') {
    const subName = subscription.name;
    return (
      <TableCell>
        <Link href={ `/subscriptions/${subscription.id}` } prefetch={ true }>
          <div className="flex flex-row items-center justify-start gap-x-2 text-wrap">
            <SubscriptionLogo subscriptionName={ subName } height={ 20 } />
            <CenterUnderline label={ subName } className="break-all" />
          </div>
        </Link>
      </TableCell>
    );
  }

  if (colId === 'billDuesCurrentYearCount') {
    return (
      <TableCell>
        <SubscriptionsTableCellDisplayCurrentYearCount subscription={ subscription } />
      </TableCell>
    );
  }

  if (colId === 'billDuesCurrentYearTotalCost') {
    return (
      <TableCell>
        <Typography className="truncate" variant={ subscription.billDuesCurrentYearTotalCost ? 'labelvalue1' : 'nodata1' }>
          { useFormatter.format(subscription.billDuesCurrentYearTotalCost ?? 0) }
        </Typography>
      </TableCell>
    );
  }

  if (colId === 'updatedAt') {
    return (
      <TableCell>
        <Popover>
          <PopoverTrigger asChild>
            <div
              title={ `${DateTime.fromISO(new Date(subscription.updatedAt ?? '').toISOString())
                .setZone(EST_TIME_ZONE)
                .toLocaleString(DateTime.DATETIME_MED)}` }
              className={ `
                flex cursor-pointer flex-col gap-y-1 truncate rounded-md border-1 border-transparent p-1 select-none
                hover:border-border hover:bg-accent
              ` }
            >
              <DateDisplay date={ subscription.updatedAt } dateFormat="MM/dd/yy" />
              <DateRelativeDisplay time={ subscription.updatedAt } includeParenthesis className="truncate" />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <DateDialogContent
              dateString={ DateTime.fromISO(new Date(subscription.updatedAt ?? '').toISOString())
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
          <SubscriptionsTableEditBillButton subscription={ subscription } />
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
